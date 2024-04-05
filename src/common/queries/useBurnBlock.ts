import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useApi } from '../api/useApi';

export const BURN_BLOCKS_QUERY_KEY = 'burnBlocks';

export function useBurnBlocks(
  heightOrHash: number | string,
  options: any = {}
): UseQueryResult<BurnBlock> {
  const api = useApi();
  return useQuery({
    queryKey: ['burn-block', heightOrHash],
    queryFn: () =>
      api.burnBlocksApi.getBurnBlock({
        heightOrHash,
      }),
    staleTime: Infinity,
    ...options,
  });
}

export function useSuspenseBurnBlock(
  heightOrHash: number | string,
  options: any = {}
): UseSuspenseQueryResult<BurnBlock> {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['burn-block', heightOrHash],
    queryFn: () =>
      api.burnBlocksApi.getBurnBlock({
        heightOrHash,
      }),
    staleTime: Infinity,
    ...options,
  });
}
