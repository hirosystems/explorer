import { TX_DETAILS_INCLUDE } from '@/app/txid/[txId]/tx-details-utils';
import { TxDetails } from '@/common/types/tx-v3';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';

export function useTxById(txId?: string, options: any = {}): UseQueryResult<TxDetails> {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['txById', txId],
    queryFn: async () => {
      if (!txId) return undefined;

      return await callApiWithErrorHandling(apiClient, '/extended/v3/transactions/{tx_id}', {
        params: {
          path: { tx_id: txId },
          query: { include: [...TX_DETAILS_INCLUDE] },
        },
      });
    },
    staleTime: Infinity,
    enabled: !!txId,
    ...options,
  });
}
