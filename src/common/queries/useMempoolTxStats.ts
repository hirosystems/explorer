import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { MempoolTransactionStatsResponse } from '@stacks/blockchain-api-client';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export function useMempoolTransactionStats(options: any = {}) {
  const api = useApi();
  return useQuery<MempoolTransactionStatsResponse>({
    queryKey: ['mempoolTransactionStats'],
    queryFn: () => {
      return api.transactionsApi.getMempoolTransactionStats();
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}

export function useSuspenseMempoolTransactionStats(options: any = {}) {
  const api = useApi();
  return useSuspenseQuery<MempoolTransactionStatsResponse>({
    queryKey: ['mempoolTransactionStats'],
    queryFn: () => {
      return api.transactionsApi.getMempoolTransactionStats();
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}
