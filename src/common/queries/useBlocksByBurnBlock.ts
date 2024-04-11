import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';

import { useApi } from '../api/useApi';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { ONE_SECOND, TWO_MINUTES } from './query-stale-time';

export const GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY = 'getBlocksByBurnBlock';

const MAX_STX_BLOCKS_PER_BURN_BLOCK_LIMIT = 30;

export function useGetBlocksByBurnBlockQuery() {
  const api = useApi();

  // Return a function that constructs the query structure
  return (heightOrHash: string | number, numStxBlocksperBtcBlock: number) => ({
    queryKey: ['stxBlocks', heightOrHash],
    queryFn: () => api.blocksApi.getBlocksByBurnBlock({
      heightOrHash,
      limit: numStxBlocksperBtcBlock,
    }),
  });
}
export function useBlocksByBurnBlock(
  heightOrHash: string | number,
  limit: number = MAX_STX_BLOCKS_PER_BURN_BLOCK_LIMIT,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<NakamotoBlock>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY, heightOrHash],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlocksByBurnBlock({
        heightOrHash,
        limit,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: heightOrHash === 'latest' ? ONE_SECOND * 5 : TWO_MINUTES,
    ...options,
  });
}

export function useSuspenseBlocksByBurnBlock(
  heightOrHash: string | number,
  limit: number = MAX_STX_BLOCKS_PER_BURN_BLOCK_LIMIT,
  options: any = {}
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<NakamotoBlock>>> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY, heightOrHash],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlocksByBurnBlock({
        heightOrHash,
        limit,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: heightOrHash === 'latest' ? ONE_SECOND * 5 : TWO_MINUTES,
    ...options,
  });
}
