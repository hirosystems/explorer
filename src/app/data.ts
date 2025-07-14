import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { PoxInfo } from '@/common/queries/usePoxInforRaw';
import { getApiUrl } from '@/common/utils/network-utils';
import { MICROSTACKS_IN_STACKS } from '@/common/utils/utils';
import { unstable_cache } from 'next/cache';

import {
  Block,
  BurnBlock,
  MempoolTransactionStatsResponse,
} from '@stacks/stacks-blockchain-api-types';

import {
  RECENT_BTC_BLOCKS_COUNT,
  RECENT_STX_BLOCKS_COUNT,
} from './_components/RecentBlocks/consts';
import { TXS_LIST_SIZE } from './consts';
import { compressTransactions } from './transactions/utils';

export type UIBtcBlock = Pick<
  BurnBlock,
  'burn_block_height' | 'burn_block_time' | 'burn_block_hash' | 'stacks_blocks' | 'total_tx_count'
>;

export type UIStxBlock = Pick<
  Block,
  'hash' | 'height' | 'burn_block_time' | 'burn_block_height' | 'burn_block_hash' | 'block_time'
> & {
  tx_count: number;
};

export type UIMempoolStats = Pick<MempoolTransactionStatsResponse, 'tx_type_counts'>;

export interface RecentBlocks {
  btcBlocks: GenericResponseType<UIBtcBlock>;
  stxBlocks: GenericResponseType<UIStxBlock>;
  stxBlocksCountPerBtcBlock: Array<{
    burn_block_height: number;
    burn_block_hash: string;
    burn_block_time: string;
    stx_blocks_count: number;
    total_tx_count: number;
  }>;
}

export interface UIStackingCycle {
  cycleId: number;
  stackedStx: number;
  progressPercentage: number;
  blocksTilNextCycle: number;
  approximateDaysTilNextCycle: number;
  approximateStartTimestamp: number;
  approximateEndTimestamp: number;
  rewardCycleLength: number;
  startBurnBlockHeight: number;
  startBurnBlockHash: string;
  startStacksBlockHeight: number;
  startStacksBlockHash: string;
  endBurnBlockHeight: number;
}

export async function fetchRecentBtcBlocks(chain: string, api?: string) {
  console.log('[debug] fetchRecentBtcBlocks started');
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/extended/v2/burn-blocks/?limit=30&offset=0`;
  console.log('[debug] BTC blocks API URL:', url);

  try {
    const response = await fetch(url, {
      cache: 'default',
      next: {
        revalidate: 300, // 5 minutes
        tags: ['btc-blocks'],
      },
    });

    console.log('[debug] BTC blocks response:', response.status, response.ok);

    const data = await response.json();
    console.log('[debug] BTC blocks data:', data?.results?.length, 'blocks received');

    return data;
  } catch (error) {
    console.error('[debug] fetchRecentBtcBlocks error for URL:', url, error);
    throw error;
  }
}

export async function fetchRecentStxBlocks(chain: string, api?: string) {
  console.log('[debug] fetchRecentStxBlocks started');
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/extended/v1/block/?limit=${RECENT_STX_BLOCKS_COUNT}&offset=0`;
  console.log('[debug] STX blocks API URL:', url);

  try {
    const response = await fetch(url, {
      cache: 'default',
      next: {
        revalidate: 10, // 10 seconds
        tags: ['stx-blocks'],
      },
    });

    console.log('[debug] STX blocks response:', response.status, response.ok);

    const data = await response.json();
    console.log('[debug] STX blocks data:', data?.results?.length, 'blocks received');

    return data;
  } catch (error) {
    console.error('[debug] fetchRecentStxBlocks error for URL:', url, error);
    throw error;
  }
}

export async function fetchStackingCycleData(chain: string, api?: string): Promise<PoxInfo> {
  console.log('[debug] fetchStackingCycleData started');
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/v2/pox`;
  console.log('[debug] stacking cycle API URL:', url);

  try {
    const response = await fetch(url, {
      cache: 'default',
      next: {
        revalidate: 60, // 60 seconds
        tags: ['stacking'],
      },
    });

    console.log('[debug] stacking cycle response:', response.status, response.ok);

    const data = await response.json();
    console.log(
      '[debug] stacking cycle data: current_cycle.id=',
      data?.current_cycle?.id,
      'reward_cycle_length=',
      data?.reward_cycle_length
    );

    return data;
  } catch (error) {
    console.error('[debug] fetchStackingCycleData error for URL:', url, error);
    throw error;
  }
}

export async function fetchStacksBlock(
  blockHeightOrHash: string | number,
  chain: string,
  api?: string
): Promise<Block> {
  console.log('[debug] fetchStacksBlock started, blockHeightOrHash:', blockHeightOrHash);
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/extended/v2/blocks/${blockHeightOrHash}`;
  console.log('[debug] stacks block API URL:', url);

  try {
    const response = await fetch(url, {
      cache: 'default',
      next: {
        revalidate: 10, // 10 seconds
        tags: ['stacking'],
      },
    });

    console.log('[debug] stacks block response:', response.status, response.ok);

    const data = await response.json();
    console.log(
      '[debug] stacks block data: height=',
      data?.height,
      'hash=',
      data?.hash?.substring(0, 10) + '...'
    );

    return data;
  } catch (error) {
    console.error('[debug] fetchStacksBlock error for URL:', url, error);
    throw error;
  }
}

export async function fetchBurnBlock(
  heightOrHash: string | number,
  chain: string,
  api?: string
): Promise<BurnBlock> {
  console.log('[debug] fetchBurnBlock started, heightOrHash:', heightOrHash);
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/extended/v2/burn-blocks/${heightOrHash}`;
  console.log('[debug] burn block API URL:', url);

  try {
    const response = await fetch(url, {
      cache: 'default',
      next: {
        revalidate: 60, // 60 seconds
        tags: ['stacking'],
      },
    });

    console.log('[debug] burn block response:', response.status, response.ok);

    const data = await response.json();
    console.log(
      '[debug] burn block data: height=',
      data?.burn_block_height,
      'stacks_blocks=',
      data?.stacks_blocks?.length
    );

    return data;
  } catch (error) {
    console.error('[debug] fetchBurnBlock error for URL:', url, error);
    throw error;
  }
}

export async function fetchMempoolStats(chain: string, api?: string) {
  console.log('[debug] fetchMempoolStats started');
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/extended/v1/tx/mempool/stats`;
  console.log('[debug] mempool stats API URL:', url);

  try {
    const response = await fetch(url, {
      cache: 'default',
      next: {
        revalidate: 10, // 10 seconds
        tags: ['mempool-stats'],
      },
    });

    console.log('[debug] mempool stats response:', response.status, response.ok);

    return response;
  } catch (error) {
    console.error('[debug] fetchMempoolStats error for URL:', url, error);
    throw error;
  }
}

export async function fetchCurrentStackingCycle(
  chain: string,
  api?: string
): Promise<UIStackingCycle> {
  console.log('[debug] fetchCurrentStackingCycle started');

  try {
    const poxData = await fetchStackingCycleData(chain, api);
    console.log('[debug] POX data received successfully');

    const NUM_TEN_MINUTES_IN_DAY = (24 * 60) / 10;

    const {
      current_cycle: { id: cycleId = 0, stacked_ustx = 0 } = ({} = {}),
      next_reward_cycle_in,
      reward_cycle_length,
      current_burnchain_block_height,
    } = poxData || {};

    console.log('[debug] extracted values:', {
      cycleId,
      stacked_ustx,
      next_reward_cycle_in,
      reward_cycle_length,
      current_burnchain_block_height,
    });

    const stackedStx = stacked_ustx / MICROSTACKS_IN_STACKS;
    const blocksTilNextCycle = next_reward_cycle_in || 0;
    const approximateDaysTilNextCycle = Math.floor(blocksTilNextCycle / NUM_TEN_MINUTES_IN_DAY);
    const progressPercentage = Number(
      (((reward_cycle_length - next_reward_cycle_in) * 100) / reward_cycle_length).toFixed(1)
    );
    const approximateDaysSinceStart = Math.floor(
      (reward_cycle_length - next_reward_cycle_in) / NUM_TEN_MINUTES_IN_DAY
    );

    const approximateStartTimestamp = new Date(
      Date.now() - approximateDaysSinceStart * 24 * 60 * 60 * 1000
    ).getTime();
    const approximateEndTimestamp = new Date(
      Date.now() + approximateDaysTilNextCycle * 24 * 60 * 60 * 1000
    ).getTime();

    const rewardCycleLength = poxData.reward_cycle_length || 0;

    const startBurnBlockHeight =
      current_burnchain_block_height - (reward_cycle_length - next_reward_cycle_in);
    const endBurnBlockHeight = current_burnchain_block_height + next_reward_cycle_in;

    console.log('[debug] calculated values:', {
      startBurnBlockHeight,
      endBurnBlockHeight,
    });

    // fetch the burn block in order to get its hash and the first stacks block hash
    const startBurnBlock = await fetchBurnBlock(startBurnBlockHeight, chain, api);
    console.log('[debug] startBurnBlock received');

    const startBurnBlockHash = startBurnBlock.burn_block_hash;
    const firstStacksBlockHashInStartBurnBlock =
      startBurnBlock.stacks_blocks?.[startBurnBlock.stacks_blocks?.length - 1];

    console.log(
      '[debug] firstStacksBlockHashInStartBurnBlock:',
      firstStacksBlockHashInStartBurnBlock
    );

    // fetch the start stacks block
    const startStacksBlock = await fetchStacksBlock(
      firstStacksBlockHashInStartBurnBlock,
      chain,
      api
    );
    console.log('[debug] startStacksBlock received');

    const startStacksBlockHeight = startStacksBlock.height;
    const startStacksBlockHash = startStacksBlock.hash;

    const result = {
      cycleId,
      stackedStx,
      progressPercentage,
      blocksTilNextCycle,
      approximateDaysTilNextCycle,
      approximateStartTimestamp,
      approximateEndTimestamp,
      rewardCycleLength,
      startBurnBlockHeight,
      startBurnBlockHash,
      startStacksBlockHeight,
      startStacksBlockHash,
      endBurnBlockHeight,
    };

    console.log('[debug] fetchCurrentStackingCycle completed successfully');
    return result;
  } catch (error) {
    console.error(
      '[debug] fetchCurrentStackingCycle error (chain:',
      chain,
      'api:',
      api,
      ')',
      error
    );
    throw error;
  }
}

export async function fetchRecentBlocks(chain: string, api?: string): Promise<RecentBlocks> {
  console.log('[debug] fetchRecentBlocks started');

  try {
    const [btcBlocksData, stxBlocksData] = await Promise.all([
      fetchRecentBtcBlocks(chain, api),
      fetchRecentStxBlocks(chain, api),
    ]);

    console.log('[debug] BTC blocks data structure:', {
      hasResults: !!btcBlocksData?.results,
      resultsLength: btcBlocksData?.results?.length,
      resultsIsArray: Array.isArray(btcBlocksData?.results),
    });

    console.log('[debug] STX blocks data structure:', {
      hasResults: !!stxBlocksData?.results,
      resultsLength: stxBlocksData?.results?.length,
      resultsIsArray: Array.isArray(stxBlocksData?.results),
    });

    const recentBtcBlockData = btcBlocksData?.results?.slice(0, RECENT_BTC_BLOCKS_COUNT) || [];
    console.log('[debug] recentBtcBlockData length:', recentBtcBlockData.length);

    const stxBlocksCountPerBtcBlock =
      btcBlocksData?.results?.map((block: BurnBlock) => ({
        burn_block_height: block.burn_block_height,
        burn_block_hash: block.burn_block_hash,
        burn_block_time: block.burn_block_time,
        stx_blocks_count: block.stacks_blocks?.length || 0,
        total_tx_count: block.total_tx_count,
      })) || [];

    console.log('[debug] stxBlocksCountPerBtcBlock length:', stxBlocksCountPerBtcBlock.length);

    const result = {
      btcBlocks: {
        ...btcBlocksData,
        results: recentBtcBlockData.map(
          (block: BurnBlock): UIBtcBlock => ({
            burn_block_height: block.burn_block_height,
            burn_block_time: block.burn_block_time,
            burn_block_hash: block.burn_block_hash,
            stacks_blocks: block.stacks_blocks,
            total_tx_count: block.total_tx_count,
          })
        ),
      },
      stxBlocks: {
        ...stxBlocksData,
        results:
          stxBlocksData?.results?.map(
            (block: Block): UIStxBlock => ({
              hash: block.hash,
              height: block.height,
              burn_block_time: block.burn_block_time,
              burn_block_height: block.burn_block_height,
              burn_block_hash: block.burn_block_hash,
              block_time: block.block_time,
              tx_count: block.txs?.length || 0,
            })
          ) || [],
      },
      stxBlocksCountPerBtcBlock,
    };

    console.log('[debug] fetchRecentBlocks completed successfully');
    return result;
  } catch (error) {
    console.error('[debug] fetchRecentBlocks error (chain:', chain, 'api:', api, ')', error);
    throw error;
  }
}

export async function fetchRecentTxs(chain: string, api?: string) {
  console.log('[debug] fetchRecentTxs started');
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/extended/v1/tx/?limit=${TXS_LIST_SIZE}&offset=0`;
  console.log('[debug] recent txs API URL:', url);

  try {
    const response = await fetch(url, {
      cache: 'default',
      next: {
        revalidate: 10, // 10 seconds
        tags: ['transactions'],
      },
    });

    console.log('[debug] recent txs response:', response.status, response.ok);

    return response;
  } catch (error) {
    console.error('[debug] fetchRecentTxs error for URL:', url, error);
    throw error;
  }
}

export async function fetchRecentUITxs(chain: string, api?: string) {
  console.log('[debug] fetchRecentUITxs started');

  try {
    const response = await fetchRecentTxs(chain, api);
    const data = await response.json();

    console.log('[debug] recent UI txs data structure:', {
      hasResults: !!data?.results,
      resultsLength: data?.results?.length,
      resultsIsArray: Array.isArray(data?.results),
    });

    const result = {
      ...data,
      results: compressTransactions(data?.results || []),
    };

    console.log('[debug] fetchRecentUITxs completed successfully');
    return result;
  } catch (error) {
    console.error('[debug] fetchRecentUITxs error (chain:', chain, 'api:', api, ')', error);
    throw error;
  }
}

export async function fetchUIMempoolStats(chain: string, api?: string): Promise<UIMempoolStats> {
  console.log('[debug] fetchUIMempoolStats started');

  try {
    const response = await fetchMempoolStats(chain, api);
    const mempoolStats = await response.json();

    console.log(
      '[debug] mempool stats data: tx_type_counts keys=',
      Object.keys(mempoolStats?.tx_type_counts || {})
    );

    const result = {
      tx_type_counts: mempoolStats?.tx_type_counts || {},
    };

    console.log('[debug] fetchUIMempoolStats completed successfully');
    return result;
  } catch (error) {
    console.error('[debug] fetchUIMempoolStats error (chain:', chain, 'api:', api, ')', error);
    throw error;
  }
}

async function _fetchTxFeeEstimation(
  transactionPayload: string,
  estimatedLen: number | null,
  chain: string,
  api?: string
) {
  const startTime = Date.now();

  console.log('[debug] fetchTxFeeEstimation started');
  const apiUrl = getApiUrl(chain, api);
  const url = `${apiUrl}/v2/fees/transaction`;
  console.log('[debug] fee estimation API URL:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estimated_len: estimatedLen,
        transaction_payload: transactionPayload,
      }),
    });

    console.log('[debug] fee estimation response:', response.status, response.ok);
    console.log(
      '[debug] CACHE MISS - actual API call made, duration:',
      Date.now() - startTime,
      'ms'
    );

    if (!response.ok) {
      console.error('[debug] fee estimation API error:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        chain: chain,
        api: api,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (response.status === 429) {
        console.error('[debug] RATE LIMIT HIT - Status 429 from fee estimation API');
      }

      throw new Error(`Fee estimation API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[debug] fee estimation data received:', {
      estimationsCount: data?.estimations?.length,
      estimationsPresent: !!data?.estimations,
      estimationsIsArray: Array.isArray(data?.estimations),
      dataKeys: Object.keys(data || {}),
      fullData: data, // Log the full response for debugging
    });

    return data;
  } catch (error) {
    console.error('[debug] fetchTxFeeEstimation error for URL:', url, {
      error: error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      chain: chain,
      api: api,
      transactionPayloadLength: transactionPayload.length,
      estimatedLen: estimatedLen,
    });
    throw error;
  }
}

// Remove individual caching - we'll cache the entire getSampleTxsFeeEstimate function instead
const fetchTxFeeEstimation = _fetchTxFeeEstimation;

export { fetchTxFeeEstimation };
