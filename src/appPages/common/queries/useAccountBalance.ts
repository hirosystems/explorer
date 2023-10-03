import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { useApi } from '@/common/api/client';
import { getNextPageParam } from '@/common/utils';

import { ONE_MINUTE } from './query-stale-time';

export const useAccountBalance = (
  api: ReturnType<typeof useApi>,
  { address = '' }: { address?: string },
  options: UseQueryOptions<any, any, AddressBalanceResponse, any> = {}
) => {
  return useQuery(
    ['accountBalance', address],
    () =>
      api.accountsApi.getAccountBalance({
        principal: address,
      }),
    {
      getNextPageParam,
      staleTime: ONE_MINUTE,
      enabled: !!address,
      ...options,
    }
  );
};
