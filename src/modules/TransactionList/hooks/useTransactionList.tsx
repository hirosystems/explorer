import { useHomeQueries } from '@features/home/useHomeQueries';
import { getNextPageParam } from '@store/common';
import { useInfiniteQuery } from 'react-query';

export function useTransactionList(limit: number) {
  console.log('[debug] useTransactionList');
  const queries = useHomeQueries();
  const confirmedTransactionsResponse = useInfiniteQuery(
    ['confirmedTransactions'],
    ({ pageParam }) => queries.fetchConfirmedTransactions(limit, pageParam || 0)(),
    { getNextPageParam }
  );
  const mempoolTransactionsResponse = useInfiniteQuery(
    ['mempoolTransactions'],
    ({ pageParam }) => queries.fetchMempoolTransactions(limit, pageParam || 0)(),
    { getNextPageParam }
  );
  return { confirmedTransactionsResponse, mempoolTransactionsResponse };
}
