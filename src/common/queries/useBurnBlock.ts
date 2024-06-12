import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useApi } from '../api/useApi';
import { useGlobalContext } from '../context/useAppContext';

export const BURN_BLOCKS_QUERY_KEY = 'burnBlocks';

export function useGetBurnBlockQuery() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return (heightOrHash: string | number) => ({
    queryKey: [BURN_BLOCKS_QUERY_KEY, heightOrHash],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v2/burn-blocks/${heightOrHash}`).then(res => res.json()),
    cacheTime: 15 * 60 * 1000,
  });
}

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
