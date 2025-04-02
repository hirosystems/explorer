import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { DEFAULT_TX_EVENTS_LIMIT } from '../constants/constants';

export function useTxById(
  txId?: string,
  options: any = {}
): UseQueryResult<Transaction | MempoolTransaction> {
  const apiClient = useApiClient();

  if (typeof window !== 'undefined') {
    console.log(`[CLIENT-SIDE] useTxById query for txId: ${txId} at ${new Date().toISOString()}`);
  } else {
    console.log(`[SERVER-SIDE] useTxById query for txId: ${txId} at ${new Date().toISOString()}`);
  }

  return useQuery({
    queryKey: ['txById', txId],
    queryFn: async () => {
      if (!txId) return undefined;

      if (typeof window !== 'undefined') {
        console.log(
          `[CLIENT-SIDE] Executing query function for useTxById: ${txId} at ${new Date().toISOString()}`
        );
      } else {
        console.log(
          `[SERVER-SIDE] Executing query function for useTxById: ${txId} at ${new Date().toISOString()}`
        );
      }

      return await callApiWithErrorHandling(apiClient, '/extended/v1/tx/{tx_id}', {
        params: {
          path: { tx_id: txId },
          query: { event_limit: DEFAULT_TX_EVENTS_LIMIT, event_offset: 0 },
        },
      });
    },
    staleTime: Infinity,
    enabled: !!txId,
    ...options,
  });
}

export function useSuspenseTxById(
  txId: string,
  options: any = {}
): UseSuspenseQueryResult<Transaction | MempoolTransaction> {
  const apiClient = useApiClient();

  if (typeof window !== 'undefined') {
    console.log(
      `[CLIENT-SIDE] useSuspenseTxById query for txId: ${txId} at ${new Date().toISOString()}`
    );
  } else {
    console.log(
      `[SERVER-SIDE] useSuspenseTxById query for txId: ${txId} at ${new Date().toISOString()}`
    );
  }

  return useSuspenseQuery({
    queryKey: ['txById', txId],
    queryFn: async () => {
      if (!txId) return undefined;

      if (typeof window !== 'undefined') {
        console.log(
          `[CLIENT-SIDE] Executing query function for useSuspenseTxById: ${txId}   at ${new Date().toISOString()}`
        );
      } else {
        console.log(
          `[SERVER-SIDE] Executing query function for useSuspenseTxById: ${txId} at ${new Date().toISOString()}`
        );
      }

      return await callApiWithErrorHandling(apiClient, '/extended/v1/tx/{tx_id}', {
        params: {
          path: { tx_id: txId },
          query: { event_limit: DEFAULT_TX_EVENTS_LIMIT, event_offset: 0 },
        },
      });
    },
    staleTime: Infinity,
    ...options,
  });
}
