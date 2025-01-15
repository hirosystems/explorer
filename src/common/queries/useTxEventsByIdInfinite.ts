import { InfiniteData, UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';

import { Transaction, TransactionEvent } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { DEFAULT_TX_EVENTS_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';

export function useTxEventsByIdInfinite(
  txId: string,
  options: any = {},
  initialData?: InfiniteData<GenericResponseType<TransactionEvent>>
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<TransactionEvent>>> {
  const apiClient = useApiClient();
  return useInfiniteQuery({
    queryKey: ['tx-by-id-infinite', txId],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const tx = await callApiWithErrorHandling(apiClient, '/extended/v1/tx/{tx_id}', {
        params: {
          path: { tx_id: txId },
          query: { event_limit: DEFAULT_TX_EVENTS_LIMIT, event_offset: pageParam },
        },
      });
      return {
        results: (tx as Transaction).events,
        total: (tx as Transaction).event_count,
        limit: DEFAULT_TX_EVENTS_LIMIT,
        offset: pageParam,
      };
    },
    staleTime: Infinity,
    getNextPageParam,
    initialPageParam: 0,
    initialData,
    // manual: true,
    ...options,
  });
}
