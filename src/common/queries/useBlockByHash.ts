import { UseSuspenseQueryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';

export function useBlockByHash(
  hash?: string,
  options: Partial<Omit<UseSuspenseQueryOptions<any, any, Block, any>, 'queryKey'>> = {}
) {
  const api = useApi();
  return useQuery({
    queryKey: ['blockByHash', hash],
    queryFn: () =>
      api.blocksApi.getBlockByHash({
        hash: hash!,
      }),
    staleTime: Infinity,
    enabled: !!hash,
    ...options,
  });
}

export function useSuspenseBlockByHash(
  hash?: string,
  options: Partial<Omit<UseSuspenseQueryOptions<any, any, Block, any>, 'queryKey'>> = {}
) {
  const api = useApi();
  if (!hash) throw new Error('Hash is required');
  return useSuspenseQuery({
    queryKey: ['blockByHash', hash],
    queryFn: () =>
      api.blocksApi.getBlockByHash({
        hash,
      }),
    staleTime: Infinity,
    ...options,
  });
}
