import { useMemo } from 'react';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import {
  GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY,
  useSuspenseBlocksByBurnBlock,
} from '../../../../common/queries/useBlocksByBurnBlock';
import {
  BURN_BLOCKS_QUERY_KEY,
  useSuspenseBurnBlocks,
} from '../../../../common/queries/useBurnBlocksInfinite';
import { BlockListBtcBlock } from '../types';
import { generateBlockList } from '../utils';
import { useBtcBlocksMap, useRefetchInitialBlockList } from './utils';

const BURN_BLOCKS_QUERY_KEY_EXTENSION = 'blockList';

export function useBlocksGroupedInitialBlockList(blockListLimit: number) {
  const response = useSuspenseBurnBlocks(blockListLimit, {}, BURN_BLOCKS_QUERY_KEY_EXTENSION);
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const btcBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(response);

  // Remove duplicates
  const uniqueBtcBlocks = useMemo(() => {
    const blockMap = new Map();
    btcBlocks.forEach(block => {
      blockMap.set(block.burn_block_hash, block);
    });
    return Array.from(blockMap.values());
  }, [btcBlocks]);

  const latestBurnBlock = useMemo(() => btcBlocks[0], [btcBlocks]);

  const btcBlocksMap = useBtcBlocksMap(btcBlocks);

  const latestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(latestBurnBlock.burn_block_height, 10, {}, 'blocks-page')
  );

  const initialStxBlockHashes = useMemo(() => {
    return new Set([...latestBurnBlockStxBlocks.map(block => block.hash)]);
  }, [latestBurnBlockStxBlocks]);

  const refetchInitialBlockList = useRefetchInitialBlockList([
    [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY],
    [BURN_BLOCKS_QUERY_KEY],
  ]);

  const initialBlockList = useMemo(() => {
    const startOfBlockList = generateBlockList(latestBurnBlockStxBlocks, btcBlocksMap);
    const restOfBlockList = uniqueBtcBlocks.slice(1).map(block => ({
      btcBlock: {
        type: 'btc_block',
        height: block.burn_block_height,
        hash: block.burn_block_hash,
        timestamp: block.burn_block_time,
        txsCount: block.stacks_blocks.length,
      } as BlockListBtcBlock,
      stxBlocks: [],
    }));
    return [...startOfBlockList, ...restOfBlockList];
  }, [latestBurnBlockStxBlocks, btcBlocksMap, uniqueBtcBlocks]);

  return {
    initialStxBlockHashes,
    initialBlockList,
    refetchInitialBlockList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
