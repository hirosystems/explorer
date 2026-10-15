import { TxEventListResponse } from '@/common/types/tx-v3';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';

export const TX_EVENTS_BY_ID_QUERY_KEY = 'tx-events-by-id';
export function getTxEventsByIdQueryKey(txId: string, limit: number, cursor?: string) {
  return [TX_EVENTS_BY_ID_QUERY_KEY, txId, limit, cursor];
}

/**
 * A page of a transaction's events, in `event_index` order. The cursor is the `event_index` of the
 * page's first event, so page N of size L starts at cursor `N * L`.
 */
export function useTxEventsById(
  txId: string,
  limit = DEFAULT_LIST_LIMIT,
  cursor?: string,
  options: any = {}
): UseQueryResult<TxEventListResponse> {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: getTxEventsByIdQueryKey(txId, limit, cursor),
    queryFn: async () => {
      return await callApiWithErrorHandling(apiClient, '/extended/v3/transactions/{tx_id}/events', {
        params: {
          path: { tx_id: txId },
          query: { limit, ...(cursor !== undefined && { cursor }) },
        },
      });
    },
    enabled: !!txId,
    ...options,
  });
}
