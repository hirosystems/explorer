import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { getApiUrl } from '@/common/utils/network-utils';
import { MICROSTACKS_IN_STACKS } from '@/common/utils/utils';
import { totalmem } from 'os';

import { Block, BurnBlock } from '@stacks/stacks-blockchain-api-types';

import {
  RECENT_BTC_BLOCKS_COUNT,
  RECENT_STX_BLOCKS_COUNT,
} from '../_components/RecentBlocks/consts';

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

export function fetchRecentBtcBlocks(chain: string, api?: string) {
  const apiUrl = getApiUrl(chain, api);
  return fetch(`${apiUrl}/extended/v2/burn-blocks/?limit=30&offset=0`).then(res => res.json());
}

export function fetchRecentStxBlocks(chain: string, api?: string) {
  const apiUrl = getApiUrl(chain, api);
  return fetch(`${apiUrl}/extended/v1/block/?limit=${RECENT_STX_BLOCKS_COUNT}&offset=0`).then(res =>
    res.json()
  );
}

export function fetchStackingCycleData(chain: string, api?: string) {
  const apiUrl = getApiUrl(chain, api);
  return fetch(`${apiUrl}/v2/pox`).then(res => res.json());
}

export async function fetchCurrentStackingCycle(
  chain: string,
  api?: string
): Promise<UIStackingCycle> {
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
}

export async function fetchRecentBlocks(chain: string, api?: string): Promise<RecentBlocks> {
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
}
