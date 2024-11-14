import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { ONE_MINUTE } from './query-stale-time';

const ACCOUNT_BALANCE_QUERY_KEY = 'accountBalance';

export function useAccountBalance(address?: string) {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: [ACCOUNT_BALANCE_QUERY_KEY, address],
    queryFn: async () => {
      if (!address) return undefined;
      return await callApiWithErrorHandling(
        apiClient,
        '/extended/v1/address/{principal}/balances',
        {
          params: { path: { principal: address } },
        }
      );
    },
    staleTime: ONE_MINUTE,
    enabled: !!address,
  });
}

export function useSuspenseAccountBalance(address?: string) {
  const apiClient = useApiClient();
  if (!address) throw new Error('Address is required');
  return useSuspenseQuery({
    queryKey: [ACCOUNT_BALANCE_QUERY_KEY, address],
    queryFn: async () => {
      return await callApiWithErrorHandling(
        apiClient,
        '/extended/v1/address/{principal}/balances',
        {
          params: { path: { principal: address } },
        }
      );
    },
    staleTime: ONE_MINUTE,
    refetchOnWindowFocus: true, // keep account balance up to date when user switches back to tab
  });
}
