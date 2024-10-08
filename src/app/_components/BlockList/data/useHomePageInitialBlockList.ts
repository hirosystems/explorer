import { useMemo } from 'react';

import { Block, BurnBlock, NakamotoBlock } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import {
  GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY,
  useSuspenseBlocksByBurnBlock,
} from '../../../../common/queries/useBlocksByBurnBlock';
import {
  BURN_BLOCKS_QUERY_KEY,
  useSuspenseBurnBlocks,
} from '../../../../common/queries/useBurnBlocksInfinite';
import { BURN_BLOCKS_QUERY_KEY_EXTENSION } from '../consts';
import { generateBlockList } from '../utils';
import { useBtcBlocksMap, useRefetchInitialBlockList } from './utils';

export function useHomePageInitialBlockList(blockListLimit: number = 3) {
  const response = useSuspenseBurnBlocks(blockListLimit, {}, BURN_BLOCKS_QUERY_KEY_EXTENSION);
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const btcBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(response);

  const latestBurnBlock = useMemo(() => btcBlocks[0], [btcBlocks]);
  const secondLatestBurnBlock = useMemo(() => btcBlocks[1], [btcBlocks]);
  const thirdLatestBurnBlock = useMemo(() => btcBlocks[2], [btcBlocks]);

  const btcBlocksMap = useBtcBlocksMap(btcBlocks);

  const latestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult<Block | NakamotoBlock>(
    useSuspenseBlocksByBurnBlock(latestBurnBlock.burn_block_height, 3)
  );
  const secondLatestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult<Block | NakamotoBlock>(
    useSuspenseBlocksByBurnBlock(secondLatestBurnBlock.burn_block_height, 3)
  );
  const thirdLatestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult<Block | NakamotoBlock>(
    useSuspenseBlocksByBurnBlock(thirdLatestBurnBlock.burn_block_height, 3)
  );

  const refetchInitialBlockList = useRefetchInitialBlockList([
    [BURN_BLOCKS_QUERY_KEY],
    [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY],
  ]);

  const initialStxBlocks = useMemo(
    () => [
      ...latestBurnBlockStxBlocks,
      ...secondLatestBurnBlockStxBlocks,
      ...thirdLatestBurnBlockStxBlocks,
    ],
    [latestBurnBlockStxBlocks, secondLatestBurnBlockStxBlocks, thirdLatestBurnBlockStxBlocks]
  );

  const initialStxBlocksHashes = useMemo(
    () => new Set(initialStxBlocks.map(block => block.hash)),
    [initialStxBlocks]
  );

  const initialBlockList = useMemo(
    () => generateBlockList(initialStxBlocks, btcBlocksMap),
    [initialStxBlocks, btcBlocksMap]
  );

  return {
    initialBlockList,
    initialStxBlocksHashes,
    initialStxBlocks,
    refetchInitialBlockList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
