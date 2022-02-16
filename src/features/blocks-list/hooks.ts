import { useInfiniteQueryAtom } from 'jotai-query-toolkit';
import { BlocksListResponse, blocksListState } from '@store/blocks';
import { DEFAULT_BLOCKS_LIST_LIMIT } from '@common/constants';
import { InfiniteData, useQuery } from 'react-query';
import { useApi } from '@common/api/client';

const queryOptions = {
  keepPreviousData: true,
  cacheTime: 10 * 60 * 1000,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  retryDelay: 120_000,
} as const;

export function useBlocksListOld(limit = DEFAULT_BLOCKS_LIST_LIMIT) {
  return useInfiniteQueryAtom<InfiniteData<BlocksListResponse> | undefined>(blocksListState(limit));
}

export function useBlocksList(limit = DEFAULT_BLOCKS_LIST_LIMIT) {
  const { blocksApi } = useApi();
  return useQuery({
    queryKey: ['blocks/CONFIRMED', limit],
    queryFn: async () => {
      return (await blocksApi.getBlockList({
        limit: DEFAULT_BLOCKS_LIST_LIMIT,
        offset: 0,
      })) as BlocksListResponse;
    },
    ...queryOptions,
  });
}
