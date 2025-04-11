import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { getApiUrl } from '@/common/utils/network-utils';
import { MICROSTACKS_IN_STACKS } from '@/common/utils/utils';
import { unstable_cache } from 'next/cache';

import {
  Block,
  BurnBlock,
  MempoolFeePriorities,
  MempoolTransactionStatsResponse,
} from '@stacks/stacks-blockchain-api-types';

import {
  RECENT_BTC_BLOCKS_COUNT,
  RECENT_STX_BLOCKS_COUNT,
} from '../_components/RecentBlocks/consts';
import { compressTransactions } from '../transactions/utils';
import { TXS_LIST_LIST_SIZE } from './consts';

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
  btcBlocks: GenericResponseType<UIBtcBlock[]>;
  stxBlocks: GenericResponseType<UIStxBlock[]>;
  stxBlocksCountPerBtcBlock: Array<{
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
  startBlockHeight: number;
  endBlockHeight: number;
}

const CACHE_1_MINUTE = 60;
const CACHE_5_MINUTES = 300;
const CACHE_15_MINUTES = 900;
const CACHE_1_HOUR = 3600;

export const fetchRecentBtcBlocks = unstable_cache(
  async (chain: string, api?: string) => {
    const apiUrl = getApiUrl(chain, api);
    const response = await fetch(`${apiUrl}/extended/v2/burn-blocks/?limit=30&offset=0`);
    return response.json();
  },
  ['recent-btc-blocks'],
  { revalidate: CACHE_5_MINUTES, tags: ['btc-blocks'] }
);

export const fetchRecentStxBlocks = unstable_cache(
  async (chain: string, api?: string) => {
    const apiUrl = getApiUrl(chain, api);
    const response = await fetch(
      `${apiUrl}/extended/v1/block/?limit=${RECENT_STX_BLOCKS_COUNT}&offset=0`
    );
    return response.json();
  },
  ['recent-stx-blocks'],
  { revalidate: CACHE_1_MINUTE, tags: ['stx-blocks'] }
);

export const fetchStackingCycleData = unstable_cache(
  async (chain: string, api?: string) => {
    const apiUrl = getApiUrl(chain, api);
    const response = await fetch(`${apiUrl}/v2/pox`);
    return response.json();
  },
  ['stacking-cycle-data'],
  { revalidate: CACHE_1_HOUR, tags: ['stacking'] }
);

export const fetchRecentTxs = unstable_cache(
  async (chain: string, api?: string) => {
    const apiUrl = getApiUrl(chain, api);
    const response = await fetch(`${apiUrl}/extended/v1/tx/?limit=${TXS_LIST_LIST_SIZE}&offset=0`);
    return response;
  },
  ['recent-txs-raw'],
  { revalidate: CACHE_1_MINUTE, tags: ['transactions'] }
);

export const fetchMempoolStats = unstable_cache(
  async (chain: string, api?: string) => {
    const apiUrl = getApiUrl(chain, api);
    const response = await fetch(`${apiUrl}/extended/v1/tx/mempool/stats`);
    return response;
  },
  ['mempool-stats-raw'],
  { revalidate: CACHE_5_MINUTES, tags: ['mempool'] }
);

export const fetchMempoolFee = unstable_cache(
  async (chain: string, api?: string): Promise<MempoolFeePriorities> => {
    const apiUrl = getApiUrl(chain, api);
    const response = await fetch(`${apiUrl}/extended/v2/mempool/fees`);
    return response.json();
  },
  ['mempool-fees'],
  { revalidate: CACHE_5_MINUTES, tags: ['mempool'] }
);

export const fetchCurrentStackingCycle = unstable_cache(
  async (chain: string, api?: string): Promise<UIStackingCycle> => {
    const poxData = await fetchStackingCycleData(chain, api);

    const NUM_TEN_MINUTES_IN_DAY = (24 * 60) / 10;

    const {
      current_cycle: { id: cycleId = 0, stacked_ustx = 0 } = ({} = {}),
      next_reward_cycle_in,
      reward_cycle_length,
      current_burnchain_block_height,
    } = poxData || {};

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

    const startBlockHeight =
      current_burnchain_block_height - (reward_cycle_length - next_reward_cycle_in);
    const endBlockHeight = current_burnchain_block_height + next_reward_cycle_in;

    return {
      cycleId,
      stackedStx,
      progressPercentage,
      blocksTilNextCycle,
      approximateDaysTilNextCycle,
      approximateStartTimestamp,
      approximateEndTimestamp,
      rewardCycleLength,
      startBlockHeight,
      endBlockHeight,
    };
  },
  ['current-stacking-cycle'],
  { revalidate: CACHE_1_HOUR, tags: ['stacking'] }
);

// Recent blocks summary - cache for 15 minutes
export const fetchRecentBlocks = unstable_cache(
  async (chain: string, api?: string): Promise<RecentBlocks> => {
    // Parallel data fetching
    const [btcBlocksData, stxBlocksData] = await Promise.all([
      fetchRecentBtcBlocks(chain, api),
      fetchRecentStxBlocks(chain, api),
    ]);

    const recentBtcBlockData = btcBlocksData.results.slice(0, RECENT_BTC_BLOCKS_COUNT);

    const stxBlocksCountPerBtcBlock = btcBlocksData.results.map((block: BurnBlock) => ({
      burn_block_time: block.burn_block_time,
      stx_blocks_count: block.stacks_blocks.length,
      total_tx_count: block.total_tx_count,
    }));

    return {
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
        results: stxBlocksData.results.map(
          (block: Block): UIStxBlock => ({
            hash: block.hash,
            height: block.height,
            burn_block_time: block.burn_block_time,
            burn_block_height: block.burn_block_height,
            burn_block_hash: block.burn_block_hash,
            block_time: block.block_time,
            tx_count: block.txs.length,
          })
        ),
      },
      stxBlocksCountPerBtcBlock,
    };
  },
  ['recent-blocks-summary'],
  { revalidate: CACHE_15_MINUTES, tags: ['blocks'] }
);

export const fetchRecentUITxs = unstable_cache(
  async (chain: string, api?: string) => {
    const response = await fetchRecentTxs(chain, api);
    const data = await response.json();
    return {
      ...data,
      results: compressTransactions(data.results),
    };
  },
  ['recent-txs-ui'],
  { revalidate: CACHE_1_MINUTE, tags: ['transactions'] }
);

export const fetchUIMempoolStats = unstable_cache(
  async (chain: string, api?: string): Promise<UIMempoolStats> => {
    const response = await fetchMempoolStats(chain, api);
    const mempoolStats = await response.json();
    return {
      tx_type_counts: mempoolStats.tx_type_counts,
    };
  },
  ['mempool-stats-ui'],
  { revalidate: CACHE_5_MINUTES, tags: ['mempool'] }
);
