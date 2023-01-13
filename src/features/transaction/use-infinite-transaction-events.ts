import { DEFAULT_TX_EVENTS_LIMIT } from '@/common/constants';
import { getNextPageParam } from '@/common/utils';
import { TransactionQueryKeys, transactionQK } from '@/features/transaction/query-keys';
import { useInfiniteQuery } from 'react-query';

import { TransactionEvent } from '@stacks/stacks-blockchain-api-types';

import { useTransactionQueries } from './use-transaction-queries';

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
