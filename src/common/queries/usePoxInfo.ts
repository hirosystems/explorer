import { UseSuspenseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { CoreNodePoxResponse } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export const useSuspensePoxInfo = (
  options: Partial<
    Omit<UseSuspenseQueryOptions<any, any, CoreNodePoxResponse, any>, 'queryKey'>
  > = {}
) => {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['poxInfo'],
    queryFn: () => api.infoApi.getPoxInfo(),
    staleTime: ONE_MINUTE,
    ...options,
  });
};
