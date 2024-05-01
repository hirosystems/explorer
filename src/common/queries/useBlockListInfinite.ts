import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export const BLOCK_LIST_QUERY_KEY = 'blockListInfinite';

export const useBlockListInfinite = () => {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: [BLOCK_LIST_QUERY_KEY],
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

export const useSuspenseBlockListInfinite = (limit = DEFAULT_LIST_LIMIT) => {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: [BLOCK_LIST_QUERY_KEY, limit],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlockList({
        limit,
        offset: pageParam || 0,
      }),
    staleTime: TWO_MINUTES,
    getNextPageParam,
    initialPageParam: 0,
  });
};

export const useSuspenseBlocksInfiniteNew = (limit = DEFAULT_LIST_LIMIT) => {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: [BLOCK_LIST_QUERY_KEY, limit],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlocks({
        limit,
        offset: pageParam || 0,
      }),
    staleTime: TWO_MINUTES,
    getNextPageParam,
    initialPageParam: 0,
  });
};
