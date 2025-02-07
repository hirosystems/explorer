import { UseSuspenseQueryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';

const BLOCK_QUERY_KEY = 'block';

export function useBlockByHeightOrHash(
  heightOrHash?: string,
  options: Partial<Omit<UseSuspenseQueryOptions<any, any, Block, any>, 'queryKey'>> = {}
) {
  const apiClient = useApiClient();
  if (!heightOrHash) throw new Error('Height or hash is required');
  return useQuery({
    queryKey: [BLOCK_QUERY_KEY, heightOrHash],
    queryFn: async () => {
      if (!heightOrHash) return undefined;
      return await callApiWithErrorHandling(apiClient, '/extended/v2/blocks/{height_or_hash}', {
        params: { path: { height_or_hash: heightOrHash } },
      });
    },
    staleTime: Infinity,
    enabled: !!heightOrHash,
    ...options,
  });
}

export function useSuspenseBlockByHeightOrHash(heightOrHash: string) {
  const apiClient = useApiClient();
  if (!heightOrHash) throw new Error('Height or hash is required');
  return useSuspenseQuery({
    queryKey: [BLOCK_QUERY_KEY, heightOrHash],
    queryFn: async () => {
      if (!heightOrHash) return undefined;
      return await callApiWithErrorHandling(apiClient, '/extended/v2/blocks/{height_or_hash}', {
        params: { path: { height_or_hash: heightOrHash } },
      });
    },
    staleTime: Infinity,
    refetchOnWindowFocus: true, // keep block up to date when user switches back to tab
  });
}
