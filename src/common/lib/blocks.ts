import { fetchBlocksList } from '@common/api/blocks';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';
import type { BlockListResponse } from '@stacks/stacks-blockchain-api-types';
import type { FetchBlocksBase } from '@common/lib/types';

/**
 * Preload react-query data on the server for blocks list data
 */
export function preloadBlocksList(opts: {
  queryClient: any;
  apiServer: string;
  options: FetchBlocksBase;
}): any {
  const { options, apiServer, queryClient } = opts;
  const { key, limit } = options;

  const fetcher = async ({ pageParam = 0 }) => {
    return fetchBlocksList({
      apiServer,
      limit,
      offset: pageParam,
    })();
  };
  return queryClient.prefetchInfiniteQuery(key, fetcher, {
    refetchInterval: DEFAULT_POLLING_INTERVAL,
    staleTime: DEFAULT_POLLING_INTERVAL,
    keepPreviousData: true,
    notifyOnChangeProps: ['data'],
    getNextPageParam: (lastPage: BlockListResponse) => {
      const { limit, offset, total } = lastPage;
      const sum = offset + limit;
      return sum < total ? sum : false;
    },
  });
}
