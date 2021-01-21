import { useApiServer } from '@common/hooks/use-api';
import { fetchTransactionsList } from '@common/lib/transactions';
import { useCallback } from 'react';
import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { generateTransactionsQueryPath } from '@common/lib/utils';

import type { FetchTransactionsBase } from '@common/lib/types';
import type {
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';

export function useFetchTransactions(
  options: FetchTransactionsBase &
    UseInfiniteQueryOptions<MempoolTransactionListResponse | TransactionResults>
): any {
  const apiServer = useApiServer();

  const makeKey = (opts: any) => {
    return generateTransactionsQueryPath({
      ...opts,
    });
  };

  const { txTypes, page, limit, mempool, key, ...hookOptions } = options;

  const fetcher = useCallback(
    async ({ pageParam = 0 }) => {
      const path = makeKey({
        ...options,
        page: pageParam,
      });
      return fetchTransactionsList(apiServer)(path);
    },
    [fetchTransactionsList, apiServer, options, txTypes]
  );

  return useInfiniteQuery<MempoolTransactionListResponse | TransactionResults>(
    [key, options],
    fetcher,
    {
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
    }
  );
}
