import type { GetServerSideProps } from 'next';
import { Configuration as TokenMetadataApiConfiguration } from '@hirosystems/token-metadata-api-client';
import { apiClients, createConfig } from '@/common/api/client';
import { DEFAULT_MAINNET_SERVER } from '@/common/constants';

import { Token } from '@/appPages/token/[tokenId]';
import { getCacheClient } from '@/common/utils/cache-client';

interface TokenLinks {
  websites: string[];
  blockchain: string[];
  chat: string[];
  forums: string[];
  announcements: string[];
  repos: string[];
  social: string[];
}

export interface TokenInfoProps {
  basic: {
    name: string;
    symbol: string;
    totalSupply: number | null;
  };
  extended: {
    categories: string[];

    links: TokenLinks;
    circulatingSupply: number | null;
    fullyDilutedValuation: number | null;
    tvl: number | null;

    currentPrice: number | null;
    priceChangePercentage24h: number | null;
    currentPriceInBtc: number | null;
    priceInBtcChangePercentage24h: number | null;

    marketCap: number | null;

    tradingVolume24h: number | null;
    tradingVolumeChangePercentage24h: number | null;

    developerData: {
      forks: number | null;
      stars: number | null;
      subscribers: number | null;
      total_issues: number | null;
      closed_issues: number | null;
      pull_requests_merged: number | null;
      pull_request_contributors: number | null;
      code_additions_deletions_4_weeks: {
        additions: number | null;
        deletions: number | null;
      } | null;
      commit_count_4_weeks: number | null;
      last_4_weeks_commit_activity_series: [] | null;
    };
  };
}

async function searchCoinGeckoTokens(tokenSymbol: string) {
  try {
    const tokenSearchResponse = (await (
      await fetch(`https://api.coingecko.com/api/v3/search?query=${tokenSymbol}`)
    ).json()) as { coins: { symbol: string; id: string }[] };
    const token = (tokenSearchResponse?.coins || []).find(
      (coin: { symbol: string; id: string }) =>
        coin.symbol?.toLowerCase() === tokenSymbol.toLowerCase()
    );
    if (!token?.id) {
      console.error("couldn't find token in Coingecko");
    }
    return token;
  } catch (error) {
    console.error(error);
  }
}

async function getTokenFromCoinGecko(tokenId: string) {
  try {
    const tokenInfoResponse = (await (
      await fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false`)
    ).json()) as {
      name: string | null;
      symbol: string | null;
      categories: string[];
      market_data: {
        circulating_supply: number | null;
        total_supply: number | null;
        fully_diluted_valuation: {
          usd: number | null;
        };
        total_value_locked: {
          usd: number | null;
        };
        current_price: {
          usd: number | null;
          btc: number | null;
        };
        price_change_percentage_24h: number | null;
        price_change_percentage_24h_in_currency: {
          btc: number | null;
        };
        market_cap: {
          usd: number | null;
        };
        total_volume: {
          usd: number | null;
        };
        volume_change_percentage_24h: number | null;
      };
      links: {
        homepage: string[] | null;
        blockchain_site: string[] | null;
        chat_url: string[] | null;
        telegram_channel_identifier: string | null;
        official_forum_url: string[] | null;
        announcement_url: string[] | null;
        repos_url: {
          github: string[] | null;
          bitbucket: string[] | null;
        };
        twitter_screen_name: string | null;
      };
      developer_data: {
        forks: number | null;
        stars: number | null;
        subscribers: number | null;
        total_issues: number | null;
        closed_issues: number | null;
        pull_requests_merged: number | null;
        pull_request_contributors: number | null;
        code_additions_deletions_4_weeks: {
          additions: number | null;
          deletions: number | null;
        } | null;
        commit_count_4_weeks: number | null;
        last_4_weeks_commit_activity_series: [] | null;
      };
    };
    return tokenInfoResponse;
  } catch (error) {
    console.error(error);
  }
}

async function getCachedTokenInfo(tokenId: string): Promise<TokenInfoProps | undefined> {
  try {
    const cachedTokenInfo = await getCacheClient().get(tokenId);
    if (cachedTokenInfo) {
      return JSON.parse(cachedTokenInfo) as TokenInfoProps;
    }
  } catch (error) {
    console.error(error);
  }
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const tokenId = Array.isArray(params?.tokenId) ? params?.tokenId[0] : params?.tokenId;
  const isMainnet = query.chain === 'mainnet';
  const isCustomApi = !!query.api;

  try {
    if (!tokenId || !isMainnet || isCustomApi) {
      throw new Error('cannot fetch token info for this request');
    }

    const cachedTokenInfo = await getCachedTokenInfo(tokenId);
    if (cachedTokenInfo) {
      console.log('cache hit', cachedTokenInfo);
      return {
        props: cachedTokenInfo,
      };
    }

    console.log('cache miss');

    const { tokenMetadataApi } = apiClients(
      createConfig(DEFAULT_MAINNET_SERVER),
      new TokenMetadataApiConfiguration({
        basePath: DEFAULT_MAINNET_SERVER,
      })
    );
    const tokenMetadata = await tokenMetadataApi?.getFtMetadata(tokenId);
    const tokenName = tokenMetadata?.name;
    const tokenSymbol = tokenMetadata?.symbol;

    if (!tokenName || !tokenSymbol) {
      throw new Error('token not found');
    }
    const token = await searchCoinGeckoTokens(tokenSymbol);

    const basicTokenInfo = {
      name: tokenMetadata?.metadata?.name || tokenName,
      symbol: tokenSymbol,
      totalSupply:
        tokenMetadata?.total_supply && tokenMetadata?.decimals
          ? Number(BigInt(tokenMetadata?.total_supply) / BigInt(10 ** tokenMetadata?.decimals))
          : null,
    };

    if (!token) {
      return {
        props: {
          basic: basicTokenInfo,
        },
      };
    }

    const tokenInfoResponse = await getTokenFromCoinGecko(token.id);

    if (!tokenInfoResponse) {
      return {
        props: {
          basic: basicTokenInfo,
        },
      };
    }

    const name = tokenInfoResponse?.name || null;
    const symbol = tokenInfoResponse?.symbol || null;
    const categories =
      tokenInfoResponse?.categories?.filter((category: string) => !!category) || [];

    const circulatingSupply = tokenInfoResponse?.market_data?.circulating_supply || null;
    const totalSupply = tokenInfoResponse?.market_data?.total_supply || null;
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

    return {
      props: tokenInfo,
    };
  } catch (error) {
    console.error(error);
    return { props: {} };
  }
};

export default Token;
