import { InfiniteData, UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';

import { Transaction, TransactionEvent } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_TX_EVENTS_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';

export function useTxEventsByIdInfinite(
  txId: string,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<TransactionEvent>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['tx-by-id-infinite', txId],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const tx = (await api.transactionsApi.getTransactionById({
        txId,
        eventLimit: DEFAULT_TX_EVENTS_LIMIT,
        eventOffset: pageParam,
      })) as Transaction;
      return {
        results: tx.events,
        total: tx.event_count,
        limit: DEFAULT_TX_EVENTS_LIMIT,
        offset: pageParam,
      };
    },
    staleTime: Infinity,
    getNextPageParam,
    initialPageParam: 0,
    ...options,
  });
}
