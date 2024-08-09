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

export const MAX_STX_BLOCKS_PER_BURN_BLOCK_LIMIT = 30;

export function useGetStxBlocksByBurnBlockQuery() {
  const api = useApi();

  return (
    heightOrHash: string | number,
    numStxBlocksperBtcBlock: number = MAX_STX_BLOCKS_PER_BURN_BLOCK_LIMIT
  ) => ({
    queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY, heightOrHash, 'special'],
    queryFn: () =>
      api.blocksApi.getBlocksByBurnBlock({
        heightOrHash,
        limit: numStxBlocksperBtcBlock,
      }),
    staleTime: TWO_MINUTES,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useBlocksByBurnBlock(
  heightOrHash: string | number,
  limit: number = MAX_STX_BLOCKS_PER_BURN_BLOCK_LIMIT,
  offset?: number,
  options?: object,
  queryKeyExtension?: string
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<NakamotoBlock>>> {
  const api = useApi();
  const rangeQueryKey = offset ? `${offset}-${offset + limit}` : '';
  return useInfiniteQuery({
    queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY, heightOrHash, rangeQueryKey, queryKeyExtension],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlocksByBurnBlock({
        heightOrHash,
        limit,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: offset ?? 0,
    staleTime: heightOrHash === 'latest' ? ONE_SECOND * 5 : TWO_MINUTES,
    ...options,
  });
}

export function useSuspenseBlocksByBurnBlock(
  heightOrHash: string | number,
  limit: number = MAX_STX_BLOCKS_PER_BURN_BLOCK_LIMIT,
  options: any = {},
  queryKeyExtension?: string
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<NakamotoBlock>>> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY, heightOrHash, queryKeyExtension],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlocksByBurnBlock({
        heightOrHash,
        limit,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: options.offset ?? 0,
    staleTime: heightOrHash === 'latest' ? ONE_SECOND * 5 : TWO_MINUTES,
    enabled: false,
    ...options,
  });
}
