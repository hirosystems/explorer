import { TransactionEvent } from '@stacks/stacks-blockchain-api-types';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { useInfiniteQuery } from 'react-query';
import { DEFAULT_TX_EVENTS_LIMIT } from '@common/constants';
import { useTransactionQueries } from './use-transaction-queries';
import { getNextPageParam } from '@common/utils';

export function useInfiniteTransactionEvents(
  txId: string,
  event_count: number,
  events: TransactionEvent[]
) {
  const queries = useTransactionQueries();
  return useInfiniteQuery(
    transactionQK(TransactionQueryKeys.events, txId),
    ({ pageParam }) => {
      return queries.fetchEventsForTx({
        txId,
        eventLimit: DEFAULT_TX_EVENTS_LIMIT,
        eventOffset: pageParam ? +pageParam || 0 : DEFAULT_TX_EVENTS_LIMIT,
      })();
    },
    { enabled: event_count > events.length, getNextPageParam, refetchOnWindowFocus: true }
  );
}
