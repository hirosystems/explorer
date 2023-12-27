import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export const useBlockListInfinite = () => {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['blockListInfinite'],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlockList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    staleTime: TWO_MINUTES,
    getNextPageParam,
    initialPageParam: 0,
  });
};

export const useSuspenseBlockListInfinite = () => {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['blockListInfinite'],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlockList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    staleTime: TWO_MINUTES,
    getNextPageParam,
    initialPageParam: 0,
    refetchOnWindowFocus: true,
  });
};
