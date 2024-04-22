import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

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

const BURN_BLOCKS_QUERY_KEY_EXTENSION = 'blockList';

export function useBlocksPageBlockListGroupedInitialBlockList(blockListLimit: number) {
  const response = useSuspenseBurnBlocks(blockListLimit, {}, BURN_BLOCKS_QUERY_KEY_EXTENSION);
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const btcBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(response);

  const latestBurnBlock = useMemo(() => btcBlocks[0], [btcBlocks]);

  const btcBlocksMap = useMemo(() => {
    const map = {} as Record<string, BurnBlock>;
    btcBlocks.forEach(block => {
      map[block.burn_block_hash] = block;
    });
    return map;
  }, [btcBlocks]);

  const latestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(latestBurnBlock.burn_block_height, 10, {}, 'blocks-page')
  );

  const initialStxBlockHashes = useMemo(() => {
    return new Set([...latestBurnBlockStxBlocks.map(block => block.hash)]);
  }, [latestBurnBlockStxBlocks]);

  const queryClient = useQueryClient();
  const refetchInitialBlockList = useCallback(
    async function (callback: () => void) {
      // Invalidate queries first
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [BURN_BLOCKS_QUERY_KEY] }),
      ]);

      // After invalidation, refetch the required queries
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY] }),
        queryClient.refetchQueries({ queryKey: [BURN_BLOCKS_QUERY_KEY] }),
      ]);

      // Run your callback after refetching
      callback();
    },
    [queryClient]
  );

  const initialBlockList = useMemo(() => {
    const startOfBlockList = generateBlockList(latestBurnBlockStxBlocks, btcBlocksMap);
    const restOfBlockList = btcBlocks.slice(1).map(block => ({
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
  }, [latestBurnBlockStxBlocks, btcBlocks, btcBlocksMap]);

  return {
    initialStxBlockHashes,
    initialBlockList,
    refetchInitialBlockList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
