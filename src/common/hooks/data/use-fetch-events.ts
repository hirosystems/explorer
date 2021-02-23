import { useApiServer } from '@common/hooks/use-api';
import { fetchEventsPaginated } from '@common/api/tx-events';
import { useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';
import type { FetchEventsPaginatedOptions } from '@common/api/tx-events';
import { TransactionEvent } from '@blockstack/stacks-blockchain-api-types';

export function useFetchEvents(
  options: FetchEventsPaginatedOptions & {
    initialData: {
      pageParams: any;
      pages: [TransactionEvent[]];
    };
    key: string;
  }
): any {
  const apiServer = useApiServer();

  const { txId, initialData, limit, key, ...hookOptions } = options;

  const fetcher = useCallback(
    async ({ pageParam = 0 }) => {
      return fetchEventsPaginated({
        txId,
        apiServer,
        limit,
        offset: pageParam,
      })();
    },
    [fetchEventsPaginated, apiServer]
  );

  return useInfiniteQuery<TransactionEvent[]>(key, fetcher, {
    ...hookOptions,
    initialData,
    refetchInterval: DEFAULT_POLLING_INTERVAL,
    staleTime: DEFAULT_POLLING_INTERVAL,
    keepPreviousData: true,
    notifyOnChangeProps: ['data'],
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 96) {
        return allPages.length * 95 + allPages.length;
      }
      return false;
    },
  });
}
