import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';

import { LUNAR_CRUSH_API_KEY } from '../../../common/constants/env';
import { LunarCrushCoin } from '../../../common/types/lunarCrush';
import { getCacheClient } from '../../../common/utils/cache-client';
import { getApiUrl } from '../../../common/utils/network-utils';
import { BasicTokenInfo, DeveloperData, TokenInfoProps, TokenLinks } from './types';

async function getToken(tokenId: string): Promise<LunarCrushCoin | undefined> {
  try {
    return await (
      await fetch(`https://lunarcrush.com/api4/public/coins/${tokenId}/v1`, {
        headers: {
          Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
        },
      })
    ).json();
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
  const isCustomApi = !!api;

  try {
    const apiUrl = isCustomApi ? api : getApiUrl(chain);
    if (!tokenId || !apiUrl || isCustomApi) {
      throw new Error('Unable to fetch token info for this request');
    }

    console.log('[debug] cache miss, fetching ', `${apiUrl}/metadata/v1/ft/${tokenId}`);

    const tokenMetadataResponse = await fetch(`${apiUrl}/metadata/v1/ft/${tokenId}`);

    const tokenMetadata: FtMetadataResponse = await tokenMetadataResponse.json();

    const tokenName = tokenMetadata?.name;
    const tokenSymbol = tokenMetadata?.symbol;

    if (!tokenName || !tokenSymbol) {
      throw new Error('token not found');
    }

    return {
      name: tokenMetadata?.metadata?.name || tokenName,
      symbol: tokenSymbol,
      totalSupply:
        tokenMetadata?.total_supply && tokenMetadata?.decimals
          ? Number(
              BigInt(tokenMetadata?.total_supply) / BigInt(Math.pow(10, tokenMetadata?.decimals))
            )
          : null,
    };
  } catch (error) {
    console.error(error);
  }
}

async function getDetailedTokenInfo(tokenId: string, basicTokenInfo: BasicTokenInfo) {
  try {
    const tokenInfoResponse = await getToken(tokenId);
    if (!tokenInfoResponse || tokenInfoResponse?.error) {
      return {
        basic: basicTokenInfo,
      };
    }

    const name = tokenInfoResponse?.data?.name || basicTokenInfo.name || null;
    const symbol = tokenInfoResponse?.data?.symbol || basicTokenInfo.symbol || null;
    const categories: string[] = [];

    const circulatingSupply = tokenInfoResponse?.data?.circulating_supply || null;
    const totalSupply = basicTokenInfo.totalSupply || null;

    const currentPrice = tokenInfoResponse?.data?.price || null;
    const currentPriceInBtc = tokenInfoResponse?.data?.price_btc || null;
    const priceChangePercentage24h = tokenInfoResponse?.data?.percent_change_24h || null;
    const priceInBtcChangePercentage24h = null;

    const marketCap = tokenInfoResponse?.data?.market_cap || null;
    const tradingVolume24h = tokenInfoResponse?.data?.volume_24h || null;
    const tradingVolumeChangePercentage24h = null;
    const developerData: DeveloperData = {
      forks: null,
      stars: null,
      subscribers: null,
      total_issues: null,
      closed_issues: null,
      pull_requests_merged: null,
      pull_request_contributors: null,
      code_additions_deletions_4_weeks: null,
      commit_count_4_weeks: null,
      last_4_weeks_commit_activity_series: null,
    };

    const links: TokenLinks = {
      websites: [],
      blockchain: [],
      chat: [],
      forums: [],
      announcements: [],
      repos: [],
      social: [],
    };

    const marketCapRank = tokenInfoResponse?.data?.market_cap_rank || null;

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

        currentPrice,
        priceChangePercentage24h,
        currentPriceInBtc,
        priceInBtcChangePercentage24h,

        marketCap,

        tradingVolume24h,
        tradingVolumeChangePercentage24h,

        developerData,
        marketCapRank,
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
  const isCustomApi = !!api;

  try {
    if (!tokenId || isCustomApi) {
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

    const detailedTokenInfo = await getDetailedTokenInfo(tokenId, basicTokenInfo);
    return detailedTokenInfo;
  } catch (error) {
    console.error(error);
    return {};
  }
}
