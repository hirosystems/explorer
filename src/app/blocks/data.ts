import { stacksAPIFetch } from '@/api/stacksAPIFetch';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { logError } from '@/common/utils/error-utils';
import { getApiUrl } from '@/common/utils/network-utils';

import { BurnBlock } from '@stacks/stacks-blockchain-api-types';

const BLOCKS_BTC_BLOCKS_LIMIT = 30;

export async function fetchBlocksBtcBlocks(chain: string, api?: string) {
  const apiUrl = getApiUrl(chain, api);
  const response = await stacksAPIFetch(
    `${apiUrl}/extended/v2/burn-blocks/?limit=${BLOCKS_BTC_BLOCKS_LIMIT}&offset=0`,
    {
      cache: 'default',
      next: {
        revalidate: 20,
        tags: ['blocks-btc-blocks'],
      },
    }
  );
  return response.json();
}

export async function fetchBlocksDefaultData(
  chain: string,
  api?: string
): Promise<{ btcBlocks: GenericResponseType<BurnBlock> }> {
  try {
    const btcBlocksData = await fetchBlocksBtcBlocks(chain, api);

    if (!btcBlocksData || typeof btcBlocksData !== 'object') {
      throw new Error('Invalid API response structure');
    }

    if (!Array.isArray(btcBlocksData.results)) {
      throw new Error('API response missing results array');
    }

    return {
      btcBlocks: btcBlocksData,
    };
  } catch (error) {
    logError(error as Error, 'fetchBlocksDefaultData', { chain, api });
    return {
      btcBlocks: {
        limit: BLOCKS_BTC_BLOCKS_LIMIT,
        offset: 0,
        total: 0,
        results: [],
      },
    };
  }
}
