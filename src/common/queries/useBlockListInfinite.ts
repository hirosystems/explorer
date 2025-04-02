import {
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export const BLOCK_LIST_QUERY_KEY = 'blockListInfinite';

export const useSuspenseBlockListInfinite = (limit = DEFAULT_LIST_LIMIT) => {
  const apiClient = useApiClient();
  return useSuspenseInfiniteQuery({
    queryKey: [BLOCK_LIST_QUERY_KEY, limit],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await callApiWithErrorHandling(apiClient, '/extended/v1/block/', {
        params: { query: { limit, offset: pageParam || 0 } },
      });
    },
    staleTime: TWO_MINUTES,
    getNextPageParam,
    initialPageParam: 0,
  });
};

export const useBlockListInfinite = (limit = DEFAULT_LIST_LIMIT) => {
  const apiClient = useApiClient();
  return useInfiniteQuery({
    queryKey: [BLOCK_LIST_QUERY_KEY, limit],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await callApiWithErrorHandling(apiClient, '/extended/v1/block/', {
        params: { query: { limit, offset: pageParam || 0 } },
      });
    },
    staleTime: TWO_MINUTES,
    getNextPageParam,
    initialPageParam: 0,
  });
};

export const useBlockList = (
  limit = DEFAULT_LIST_LIMIT,
  options?: any
): UseQueryResult<GenericResponseType<Block>> => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: [BLOCK_LIST_QUERY_KEY, limit],
    queryFn: async () => {
      return await callApiWithErrorHandling(apiClient, '/extended/v1/block/', {
        params: { query: { limit } },
      });
    },
    staleTime: TWO_MINUTES,
    ...options,
  });
};
