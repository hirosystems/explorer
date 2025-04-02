import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { getApiUrl } from '@/common/utils/network-utils';

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
}

export function fetchRecentBtcBlocks(chain: string, api?: string) {
  const apiUrl = api || getApiUrl(chain);
  return fetch(`${apiUrl}/extended/v2/burn-blocks/?limit=${RECENT_BTC_BLOCKS_COUNT}&offset=0`).then(
    res => res.json()
  );
}

export function fetchRecentStxBlocks(chain: string, api?: string) {
  const apiUrl = api || getApiUrl(chain);
  return fetch(`${apiUrl}/extended/v1/block/?limit=${RECENT_STX_BLOCKS_COUNT}&offset=0`).then(res =>
    res.json()
  );
}

export async function fetchRecentBlocks(chain: string, api?: string): Promise<RecentBlocks> {
  const [btcBlocksData, stxBlocksData] = await Promise.all([
    fetchRecentBtcBlocks(chain, api),
    fetchRecentStxBlocks(chain, api),
  ]);

  return {
    btcBlocks: {
      ...btcBlocksData,
      results: btcBlocksData.results.map(
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
  };
}
