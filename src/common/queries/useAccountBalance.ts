import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

const ACCOUNT_BALANCE_QUERY_KEY = 'accountBalance';

export function useAccountBalance(
  address?: string,
  options: Omit<UseQueryOptions<any, any, AddressBalanceResponse, any>, 'queryKey' | 'queryFn'> = {}
) {
  const api = useApi();
  return useQuery({
    queryKey: [ACCOUNT_BALANCE_QUERY_KEY, address],
    queryFn: () => {
      if (!address) return undefined;
      const response = api.accountsApi.getAccountBalance({
        principal: address,
      });
      return response;
    },
    staleTime: ONE_MINUTE,
    enabled: !!address,
    ...options,
  });
}

export function useSuspenseAccountBalance(
  address?: string,
  options: Omit<
    UseSuspenseQueryOptions<any, any, AddressBalanceResponse, any>,
    'queryKey' | 'queryFn'
  > = {}
) {
  const api = useApi();
  if (!address) throw new Error('Address is required');
  return useSuspenseQuery({
    queryKey: [ACCOUNT_BALANCE_QUERY_KEY, address],
    queryFn: () => {
      const response = api.accountsApi.getAccountBalance({
        principal: address,
      });

      return response;
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}
