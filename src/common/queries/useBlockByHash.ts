import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { useGlobalContext } from '../context/useGlobalContext';

const BLOCK_QUERY_KEY = 'block';

const getBlockByHashQueryKey = (hash: string | undefined, activeNetworkKey: string) => [
  'blockByHash',
  hash,
  activeNetworkKey,
];

export function useBlockByHash(hash?: string, options: any = {}) {
  const apiClient = useApiClient();
  const { activeNetworkKey } = useGlobalContext();
  return useQuery<Block>({
    queryKey: getBlockByHashQueryKey(hash, activeNetworkKey),
    queryFn: async () => {
      if (!hash) return undefined;
      return (await callApiWithErrorHandling(apiClient, '/extended/v2/blocks/{height_or_hash}', {
        params: { path: { height_or_hash: hash } },
      })) as unknown as Block;
    },
    staleTime: Infinity,
    enabled: !!hash,
    ...options,
  });
}

export function useSuspenseBlockByHeightOrHash(heightOrHash: string) {
  const apiClient = useApiClient();
  const { activeNetworkKey } = useGlobalContext();
  if (!heightOrHash) throw new Error('Height or hash is required');
  return useSuspenseQuery({
    queryKey: [BLOCK_QUERY_KEY, heightOrHash, activeNetworkKey],
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
