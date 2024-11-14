import { useSuspenseQuery } from '@tanstack/react-query';

import { OperationResponse } from '@stacks/blockchain-api-client';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { ONE_MINUTE } from './query-stale-time';

export function useSuspenseMempoolTransactionStats() {
  const apiClient = useApiClient();
  return useSuspenseQuery<OperationResponse['/extended/v1/tx/mempool/stats']>({
    queryKey: ['mempoolTransactionStats'],
    queryFn: async () => {
      return await callApiWithErrorHandling(apiClient, '/extended/v1/tx/mempool/stats');
    },
    staleTime: ONE_MINUTE,
  });
}
