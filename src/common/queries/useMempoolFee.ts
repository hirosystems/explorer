import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types/generated';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { ONE_MINUTE } from './query-stale-time';

export function useSuspenseMempoolFee(options: any = {}) {
  const apiClient = useApiClient();
  return useSuspenseQuery({
    queryKey: ['mempoolFee'],
    queryFn: async () => {
      return await callApiWithErrorHandling(apiClient, '/extended/v2/mempool/fees');
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}

export function useMempoolFee(options: any = {}) {
  const apiClient = useApiClient();
  return useQuery<MempoolFeePriorities>({
    queryKey: ['mempoolFee'],
    queryFn: async () => {
      return await callApiWithErrorHandling(apiClient, '/extended/v2/mempool/fees');
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}
