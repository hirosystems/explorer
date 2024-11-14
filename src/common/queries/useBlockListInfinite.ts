import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
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
