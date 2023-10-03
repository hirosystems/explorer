import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';
import { DEFAULT_TX_EVENTS_LIMIT } from '@/common/constants';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export const useTxById = (
  api: ReturnType<typeof useApi>,
  { txId }: { txId: string },
  options: UseQueryOptions<any, any, Transaction | MempoolTransaction, any> = {}
) => {
  return useQuery(
    ['txById', txId],
    () =>
      api.transactionsApi.getTransactionById({
        txId,
        eventLimit: DEFAULT_TX_EVENTS_LIMIT,
        eventOffset: 0,
      }),
    { staleTime: Infinity, ...options }
  );
};
