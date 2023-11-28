import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export function useBlockByHeight(height: number, options: any = {}): UseQueryResult<Block> {
  const api = useApi();
  return useQuery({
    queryKey: ['block-by-height', height],
    queryFn: () => api.blocksApi.getBlockByHeight({ height }),
    staleTime: ONE_MINUTE,
    ...options,
  });
}
