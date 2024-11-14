import { UseSuspenseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { CoreNodePoxResponse } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../context/useGlobalContext';
import { ONE_MINUTE } from './query-stale-time';

export const useSuspensePoxInfo = (
  options: Partial<
    Omit<UseSuspenseQueryOptions<any, any, CoreNodePoxResponse, any>, 'queryKey'>
  > = {}
) => {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useSuspenseQuery({
    queryKey: ['poxInfo'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/pox`).then(res => res.json()),
    staleTime: ONE_MINUTE,
    ...options,
  });
};
