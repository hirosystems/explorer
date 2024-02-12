import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export function useFetchAccountBalance() {
  const api = useApi();

  const fetchAccountBalance = async (address: string) => {
    return api.accountsApi.getAccountBalance({
      principal: address,
    });
  };

  return fetchAccountBalance;
}

export function useAccountBalance(
  address?: string,
  options: Omit<UseQueryOptions<any, any, AddressBalanceResponse, any>, 'queryKey' | 'queryFn'> = {}
) {
  const api = useApi();
  return useQuery({
    queryKey: ['accountBalance', address],
    queryFn: () => {
      return api.accountsApi.getAccountBalance({
        principal: address!,
      });
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
    queryKey: ['accountBalance', address],
    queryFn: () => {
      return api.accountsApi.getAccountBalance({
        principal: address,
      });
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}
