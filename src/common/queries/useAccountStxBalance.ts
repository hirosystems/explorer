import { useQuery } from '@tanstack/react-query';

import { AddressStxBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { THREE_MINUTES } from './query-stale-time';

export function useAccountStxBalance(principal: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['stx-balance', principal],
    queryFn: () =>
      api.accountsApi.getAccountStxBalance({ principal }) as Promise<AddressStxBalanceResponse>,
    staleTime: THREE_MINUTES,
  });
}
