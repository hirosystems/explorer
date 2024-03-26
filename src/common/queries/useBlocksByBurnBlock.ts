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

export function useBlocksByBurnBlock(
  heightOrHash: string | number,
  limit: number,
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
  limit: number,
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
