import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY } from '../../../../common/queries/useBlocksByBurnBlock';
import {
  BURN_BLOCKS_QUERY_KEY,
  useSuspenseBurnBlocks,
} from '../../../../common/queries/useBurnBlocksInfinite';
import { BURN_BLOCKS_BLOCK_LIST_UNGROUPED_QUERY_KEY_EXTENSION } from '../consts';
import { generateBlockList } from '../utils';
import { useStxBlocksForBtcBlocks } from './useStxBlocksForBtcBlocks';

export function useBlocksPageBlockListUngroupedInitialBlockList(blockListLimit: number = 3) {
  const response = useSuspenseBurnBlocks(
    blockListLimit,
    {},
    BURN_BLOCKS_BLOCK_LIST_UNGROUPED_QUERY_KEY_EXTENSION
  );
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const btcBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(response);

  const initialStxBlocks = useStxBlocksForBtcBlocks(btcBlocks);

  const btcBlocksMap = useMemo(() => {
    const map = {} as Record<string, BurnBlock>;
    btcBlocks.forEach(block => {
      map[block.burn_block_hash] = block;
    });
    return map;
  }, [btcBlocks]);

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

      // Run callback after refetching
      callback();
    },
    [queryClient]
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
