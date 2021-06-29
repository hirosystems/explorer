import { useApiServer } from '@common/hooks/use-api';
import { fetchBlocksList } from '@common/api/blocks';
import { useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';

import type { BlockListResponse } from '@stacks/stacks-blockchain-api-types';
import type { FetchBlocksBase } from '@common/lib/types';

export function useFetchBlocks(options: FetchBlocksBase): any {
  const apiServer = useApiServer();

  const { page, limit, key, ...hookOptions } = options;

  const fetcher = useCallback(
    async ({ pageParam = 0 }) => {
      return fetchBlocksList({
        apiServer,
        limit,
        offset: pageParam,
      })();
    },
    [fetchBlocksList, apiServer]
  );

  return useInfiniteQuery<BlockListResponse>(key, fetcher, {
    ...hookOptions,
    refetchInterval: DEFAULT_POLLING_INTERVAL,
    staleTime: DEFAULT_POLLING_INTERVAL,
    keepPreviousData: true,
    notifyOnChangeProps: ['data'],
    getNextPageParam: lastPage => {
      const { limit, offset, total } = lastPage;
      const sum = offset + limit;
      return sum < total ? sum : false;
    },
  });
}
