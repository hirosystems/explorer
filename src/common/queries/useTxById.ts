import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_TX_EVENTS_LIMIT } from '../constants/constants';

export function useSuspenseTxById(
  txId: string,
  options: any = {}
): UseSuspenseQueryResult<Transaction | MempoolTransaction> {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['txById', txId],
    queryFn: () => {
      return api.transactionsApi.getTransactionById({
        txId,
        eventLimit: DEFAULT_TX_EVENTS_LIMIT,
        eventOffset: 0,
      });
    },
    staleTime: Infinity,
    ...options,
  });
}
