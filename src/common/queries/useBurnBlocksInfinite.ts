import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { DEFAULT_BURN_BLOCKS_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export const BURN_BLOCKS_QUERY_KEY = 'burnBlocks';

export function useBurnBlocks(
  limit = DEFAULT_BURN_BLOCKS_LIMIT,
  options: any = {},
  queryKeyExtension?: string
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<BurnBlock>>> {
  const apiClient = useApiClient();
  return useInfiniteQuery({
    queryKey: queryKeyExtension
      ? [BURN_BLOCKS_QUERY_KEY, limit, queryKeyExtension]
      : [BURN_BLOCKS_QUERY_KEY, limit],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await callApiWithErrorHandling(apiClient, '/extended/v2/burn-blocks/', {
        params: { query: { limit, offset: pageParam } },
      });
    },
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}

export function useSuspenseBurnBlocks(
  limit = DEFAULT_BURN_BLOCKS_LIMIT,
  options: any = {},
  queryKeyExtension?: string
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<BurnBlock>>> {
  const apiClient = useApiClient();
  return useSuspenseInfiniteQuery({
    queryKey: queryKeyExtension
      ? [BURN_BLOCKS_QUERY_KEY, limit, queryKeyExtension]
      : [BURN_BLOCKS_QUERY_KEY, limit],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await callApiWithErrorHandling(apiClient, '/extended/v2/burn-blocks/', {
        params: { query: { limit, offset: pageParam } },
      });
    },
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
