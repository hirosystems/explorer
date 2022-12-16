import { useHomeQueries } from '@features/home/useHomeQueries';
import { useInfiniteQuery } from 'react-query';

import { getNextPageParam } from '@common/utils';

export function useTransactionList(limit: number) {
  console.log('[debug] useTransactionList');
  const queries = useHomeQueries();
  const confirmedTransactionsResponse = useInfiniteQuery(
    ['confirmedTransactions'],
    ({ pageParam }) => queries.fetchConfirmedTransactions(limit, pageParam || 0)(),
    { getNextPageParam, refetchOnWindowFocus: true }
  );
  const mempoolTransactionsResponse = useInfiniteQuery(
    ['mempoolTransactions'],
    ({ pageParam }) => queries.fetchMempoolTransactions(limit, pageParam || 0)(),
    { getNextPageParam, refetchOnWindowFocus: true }
  );
  return { confirmedTransactionsResponse, mempoolTransactionsResponse };
}
