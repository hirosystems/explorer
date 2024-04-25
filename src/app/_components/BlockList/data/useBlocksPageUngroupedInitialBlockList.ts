import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { BurnBlock, NakamotoBlockListResponse } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import {
  GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY,
  useGetStxBlocksByBurnBlockQuery,
} from '../../../../common/queries/useBlocksByBurnBlock';
import {
  BURN_BLOCKS_QUERY_KEY,
  useSuspenseBurnBlocks,
} from '../../../../common/queries/useBurnBlocksInfinite';
import { BURN_BLOCKS_BLOCK_LIST_UNGROUPED_QUERY_KEY_EXTENSION } from '../consts';
import { generateBlockList } from '../utils';
import { useBtcBlocksMap, useRefetchInitialBlockList } from './utils';

export function useBlocksPageUngroupedInitialBlockList(blockListLimit: number) {
  const response = useSuspenseBurnBlocks(
    blockListLimit,
    {},
    BURN_BLOCKS_BLOCK_LIST_UNGROUPED_QUERY_KEY_EXTENSION
  );
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const btcBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(response);
  const queryClient = useQueryClient();
  const getQuery = useGetStxBlocksByBurnBlockQuery();
  const stxBlockQueries = useMemo(() => {
    return {
      queries: btcBlocks.map(btcBlock => {
        return getQuery(btcBlock.burn_block_height);
      }),
      combine: (response: UseQueryResult<NakamotoBlockListResponse, Error>[]) => {
        const result = response.flatMap(data => data.data?.results || []);
        return result;
      },
    };
  }, [btcBlocks, getQuery]);
  const initialStxBlocks = useQueries(stxBlockQueries, queryClient);

  const btcBlocksMap = useBtcBlocksMap(btcBlocks);

  const refetchInitialBlockList = useRefetchInitialBlockList([
    [BURN_BLOCKS_QUERY_KEY],
    [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY],
  ]);

  const initialStxBlocksHashes = useMemo(() => {
    return new Set(initialStxBlocks.map(block => block.hash));
  }, [initialStxBlocks]);

  const initialBlockList = useMemo(() => {
    return generateBlockList(initialStxBlocks, btcBlocksMap);
  }, [initialStxBlocks, btcBlocksMap]);

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
