import { ContractResponse } from '@/common/types/tx';
import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';

import { getIsSBTC } from '../../../app/tokens/utils';
import { LUNAR_CRUSH_API_KEY } from '../../../common/constants/env';
import { LunarCrushCoin } from '../../../common/types/lunarCrush';
import { getCacheClient } from '../../../common/utils/cache-client';
import { getApiUrl } from '../../../common/utils/network-utils';
import { getFtDecimalAdjustedBalance } from '../../../common/utils/utils';
import { HolderResponseType } from './Tabs/data/useHolders';
import { BasicTokenInfo, DeveloperData, TokenInfoProps, TokenLinks } from './types';

async function getTokenInfoFromLunarCrush(tokenId: string): Promise<LunarCrushCoin | undefined> {
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

async function getCirculatingSupplyFromHoldersEndpoint(apiUrl: string, tokenId: string) {
  const contractInfoResponse = await fetch(`${apiUrl}/extended/v1/contract/${tokenId}`);
  if (!contractInfoResponse.ok) {
    console.error('Failed to fetch contract info');
    return null;
  }
  const contractInfo: ContractResponse = await contractInfoResponse.json();
  if (!contractInfo.abi) {
    console.error('No ABI found for token');
    return null;
  }
  const abi = JSON.parse(contractInfo.abi);
  if (!abi?.fungible_tokens || abi.fungible_tokens.length === 0) {
    console.error('No fungible tokens found in ABI');
    return null;
  }
  const ftName = abi.fungible_tokens[0].name;
  const fullyQualifiedTokenId = `${tokenId}::${ftName}`;
  const holdersResponse = await fetch(
    `${apiUrl}/extended/v1/tokens/ft/${fullyQualifiedTokenId}/holders`
  );
  if (!holdersResponse.ok) {
    console.error('Failed to fetch holders info');
    return null;
  }
  const holdersInfo: HolderResponseType = await holdersResponse.json();
  if (!holdersInfo?.total_supply) {
    console.error('No total supply found in holders info');
    return null;
  }
  const holdersCirculatingSupply = holdersInfo.total_supply;
  return holdersCirculatingSupply;
}

async function getBasicTokenInfoFromStacksApi(
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

    const tokenMetadataResponse = await fetch(`${apiUrl}/metadata/v1/ft/${tokenId}`);
    const tokenMetadata: FtMetadataResponse = await tokenMetadataResponse.json();

    const tokenName = tokenMetadata?.name;
    const tokenSymbol = tokenMetadata?.symbol;
    const tokenDecimals = tokenMetadata?.decimals;

    if (!tokenName || !tokenSymbol) {
      throw new Error('token not found');
    }

    const holdersCirculatingSupply = await getCirculatingSupplyFromHoldersEndpoint(apiUrl, tokenId);

    return {
      name: tokenMetadata?.metadata?.name || tokenName,
      symbol: tokenSymbol,
      totalSupply:
        tokenMetadata?.total_supply && tokenDecimals
          ? getFtDecimalAdjustedBalance(tokenMetadata?.total_supply, tokenDecimals)
          : null,
      circulatingSupply: holdersCirculatingSupply
        ? getFtDecimalAdjustedBalance(holdersCirculatingSupply, tokenDecimals || 0)
        : null,
      imageUri: tokenMetadata?.image_uri,
    };
  } catch (error) {
    console.error(error);
  }
}

async function getDetailedTokenInfoFromLunarCrush(tokenId: string, basicTokenInfo: BasicTokenInfo) {
  try {
    const lunarCrushResponse = await getTokenInfoFromLunarCrush(tokenId);
    const lunarCrushError = lunarCrushResponse?.error;
    const lunarCrushData = lunarCrushResponse?.data;
    if (!lunarCrushResponse || lunarCrushError || !lunarCrushData) {
      console.error('token not found in LunarCrush'); // TODO: actually log the error
      return {
        basic: basicTokenInfo,
      }
      // return null; 
    }

    const isSBTC = getIsSBTC(tokenId);

    const name = lunarCrushData?.name || basicTokenInfo.name || null;
    const symbol = lunarCrushData?.symbol || basicTokenInfo.symbol || null;
    const categories: string[] = [];

    const totalSupply = basicTokenInfo.totalSupply || null;
    const circulatingSupplyFromBasicTokenInfo = basicTokenInfo.circulatingSupply || null;
    const circulatingSupply = isSBTC
      ? circulatingSupplyFromBasicTokenInfo // LunarCrush is returning an incorrect circulating supply for SBTC. Use the circulating supply from the holders endpoint on Stacks API instead.
      : lunarCrushData?.circulating_supply || circulatingSupplyFromBasicTokenInfo || null;
    const imageUri = basicTokenInfo.imageUri || undefined;

    const currentPrice = lunarCrushData?.price || null;
    const currentPriceInBtc = lunarCrushData?.price_btc || null;
    const priceChangePercentage24h = lunarCrushData?.percent_change_24h || null;
    const priceInBtcChangePercentage24h = null;

    const marketCap = lunarCrushData?.market_cap || null;
    const tradingVolume24h = lunarCrushData?.volume_24h || null;
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

    const marketCapRank = lunarCrushData?.market_cap_rank || null;

    const tokenInfo = {
      basic: {
        name,
        symbol,
        totalSupply,
        imageUri,
        circulatingSupply,
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
    console.log('server', { tokenInfo, apiKey: LUNAR_CRUSH_API_KEY});
    return tokenInfo;
  } catch (error) {
    console.error(error);
    return {
      basic: basicTokenInfo,
    };
  }
}

function mergeTokenInfo(basicTokenInfo: BasicTokenInfo, lunarCrushData: LunarCrushCoin) {
  return {
    basic: basicTokenInfo,
    extended: lunarCrushData,
  };
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

    const basicTokenInfo = await getBasicTokenInfoFromStacksApi(tokenId, chain, api);
    if (!basicTokenInfo) {
      return {};
    }

    const detailedTokenInfo = await getDetailedTokenInfoFromLunarCrush(tokenId, basicTokenInfo);
    return detailedTokenInfo;
  } catch (error) {
    console.error(error);
    return {};
  }
}
