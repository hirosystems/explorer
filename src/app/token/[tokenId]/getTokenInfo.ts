import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';

import { DEFAULT_MAINNET_SERVER } from '../../../common/constants/env';
import { getCacheClient } from '../../../common/utils/cache-client';
import { BasicTokenInfo, TokenInfoProps, TokenLinks } from './types';

async function searchCoinGeckoTokens(tokenSymbol: string) {
  try {
    const tokenSearchResponse = await (
      await fetch(`https://api.coingecko.com/api/v3/search?query=${tokenSymbol}`)
    ).json();
    const token = (tokenSearchResponse?.coins || []).find(
      (coin: { symbol: string; id: string }) =>
        coin.symbol?.toLowerCase() === tokenSymbol.toLowerCase()
    );
    if (!token?.id) {
      console.log(`[debug] couldn't find token with symbol ${tokenSymbol} in Coingecko`);
      return;
    }
    return token;
  } catch (error) {
    console.error(error);
  }
}

async function getTokenFromCoinGecko(tokenId: string) {
  try {
    const tokenInfoResponse = await (
      await fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false`)
    ).json();
    return tokenInfoResponse;
  } catch (error) {
    console.error(error);
  }
}

async function getCachedTokenInfo(tokenId: string) {
  try {
    const cachedTokenInfo = await getCacheClient().get(tokenId);
    if (cachedTokenInfo) {
      return JSON.parse(cachedTokenInfo);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getBasicTokenInfo(
  tokenId: string,
  chain: string,
  api?: string
): Promise<BasicTokenInfo | undefined> {
  const isMainnet = chain === 'mainnet';
  const isCustomApi = !!api;

  try {
    if (!tokenId || !isMainnet || isCustomApi) {
      throw new Error('cannot fetch token info for this request');
    }

    console.log(
      '[debug] cache miss, fetching ',
      `${DEFAULT_MAINNET_SERVER}/metadata/v1/ft/${tokenId}`
    );

    const tokenMetadataResponse = await fetch(
      `${DEFAULT_MAINNET_SERVER}/metadata/v1/ft/${tokenId}`
    );

    const tokenMetadata: FtMetadataResponse = await tokenMetadataResponse.json();

    const tokenName = tokenMetadata?.name;
    const tokenSymbol = tokenMetadata?.symbol;

    if (!tokenName || !tokenSymbol) {
      throw new Error('token not found');
    }

    const basicTokenInfo = {
      name: tokenMetadata?.metadata?.name || tokenName,
      symbol: tokenSymbol,
      totalSupply:
        tokenMetadata?.total_supply && tokenMetadata?.decimals
          ? Number(
              BigInt(tokenMetadata?.total_supply) / BigInt(Math.pow(10, tokenMetadata?.decimals))
            )
          : null,
    };

    return basicTokenInfo;
  } catch (error) {
    console.error(error);
  }
}

async function getDetailedTokenInfo(tokenId: string, basicTokenInfo: BasicTokenInfo) {
  try {
    const token = await searchCoinGeckoTokens(basicTokenInfo.symbol);
    if (!token) {
      return {
        basic: basicTokenInfo,
      };
    }

    const tokenInfoResponse = await getTokenFromCoinGecko(token.id);
    if (!tokenInfoResponse || tokenInfoResponse?.status?.error_code) {
      return {
        basic: basicTokenInfo,
      };
    }

    const name = tokenInfoResponse?.name || basicTokenInfo.name || null;
    const symbol = tokenInfoResponse?.symbol || basicTokenInfo.symbol || null;
    const categories =
      tokenInfoResponse?.categories?.filter((category: string) => !!category) || [];

    const circulatingSupply = tokenInfoResponse?.market_data?.circulating_supply || null;
    const totalSupply =
      tokenInfoResponse?.market_data?.total_supply || basicTokenInfo.totalSupply || null;
    const fullyDilutedValuation =
      tokenInfoResponse?.market_data?.fully_diluted_valuation?.usd || null;
    const tvl = tokenInfoResponse?.market_data?.total_value_locked?.usd || null;

    const currentPrice = tokenInfoResponse?.market_data?.current_price?.usd || null;
    const currentPriceInBtc = tokenInfoResponse?.market_data?.current_price?.btc || null;
    const priceChangePercentage24h =
      tokenInfoResponse?.market_data?.price_change_percentage_24h || null;
    const priceInBtcChangePercentage24h =
      tokenInfoResponse?.market_data?.price_change_percentage_24h_in_currency?.btc || null;

    const marketCap = tokenInfoResponse?.market_data?.market_cap?.usd || null;
    const tradingVolume24h = tokenInfoResponse?.market_data?.total_volume?.usd || null;
    const tradingVolumeChangePercentage24h =
      tokenInfoResponse?.market_data?.volume_change_percentage_24h || null;
    const developerData = tokenInfoResponse?.developer_data || {};

    const links: TokenLinks = {
      websites: tokenInfoResponse?.links?.homepage?.filter((link: string) => !!link) || [],
      blockchain: tokenInfoResponse?.links?.blockchain_site?.filter((link: string) => !!link) || [],
      chat: [
        ...(tokenInfoResponse?.links?.chat_url?.filter((link: string) => !!link) || []),
        ...(tokenInfoResponse?.links?.telegram_channel_identifier
          ? [`https://t.me/${tokenInfoResponse.links.telegram_channel_identifier}`]
          : []),
      ],
      forums: tokenInfoResponse?.links?.official_forum_url?.filter((link: string) => !!link) || [],
      announcements:
        tokenInfoResponse?.links?.announcement_url?.filter((link: string) => !!link) || [],
      repos: [
        ...(tokenInfoResponse?.links?.repos_url?.github?.filter((link: string) => !!link) || []),
        ...(tokenInfoResponse?.links?.repos_url?.bitbucket?.filter((link: string) => !!link) || []),
      ],
      social: [
        ...(tokenInfoResponse?.links?.twitter_screen_name
          ? [`https://twitter.com/${tokenInfoResponse.links.twitter_screen_name}`]
          : []),
      ],
    };

    const tokenInfo = {
      basic: {
        name,
        symbol,
        totalSupply,
      },
      extended: {
        categories,

        links,
        circulatingSupply,
        fullyDilutedValuation,
        tvl,

        currentPrice,
        priceChangePercentage24h,
        currentPriceInBtc,
        priceInBtcChangePercentage24h,

        marketCap,

        tradingVolume24h,
        tradingVolumeChangePercentage24h,

        developerData,
      },
    };

    await getCacheClient().set(tokenId, JSON.stringify(tokenInfo), 'EX', 60 * 10); // expires in 10 minutes

    return tokenInfo;
  } catch (error) {
    console.error(error);
    return {
      basic: basicTokenInfo,
    };
  }
}

export async function getTokenInfo(
  tokenId: string,
  chain: string,
  api?: string
): Promise<TokenInfoProps> {
  const isMainnet = chain === 'mainnet';
  const isCustomApi = !!api;

  try {
    if (!tokenId || !isMainnet || isCustomApi) {
      throw new Error('cannot fetch token info for this request');
    }

    const cachedTokenInfo = await getCachedTokenInfo(tokenId);
    if (cachedTokenInfo) {
      console.log('[debug] cache hit');
      return cachedTokenInfo;
    }

    const basicTokenInfo = await getBasicTokenInfo(tokenId, chain, api);
    if (!basicTokenInfo) {
      return {};
    }

    return getDetailedTokenInfo(tokenId, basicTokenInfo);
  } catch (error) {
    console.error(error);
    return {};
  }
}
