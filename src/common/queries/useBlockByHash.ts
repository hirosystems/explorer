import { UseSuspenseQueryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { useGlobalContext } from '../context/useGlobalContext';

const BLOCK_QUERY_KEY = 'block';

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

// TODO: Use this until we update @stacks/stacks-blockchain-client
interface BlockWithTenureHeight extends Block {
  tenure_height: number | null;
  tx_count: number;
}

export function useSuspenseBlockByHeightOrHash(
  heightOrHash: string,
  options: Partial<
    Omit<UseSuspenseQueryOptions<any, any, BlockWithTenureHeight, any>, 'queryKey'>
  > = {}
) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  if (!heightOrHash) throw new Error('Height or hash is required');
  return useSuspenseQuery({
    queryKey: [BLOCK_QUERY_KEY, heightOrHash],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v2/blocks/${heightOrHash}`).then(res => res.json()),
    staleTime: Infinity,
    ...options,
  });
}
