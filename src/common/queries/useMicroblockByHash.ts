import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

import { Microblock } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';

export function useSuspenseMicroblockByHash(
  microblockHash: string,
  options: any = {}
): UseSuspenseQueryResult<Microblock> {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['microblockByHash', microblockHash],
    queryFn: () =>
      api.microblocksApi.getMicroblockByHash({
        hash: microblockHash,
      }),
    staleTime: Infinity,
    ...options,
  });
}
