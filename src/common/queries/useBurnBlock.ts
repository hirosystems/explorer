import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useApi } from '../api/useApi';

export const BURN_BLOCKS_QUERY_KEY = 'burnBlocks';

export function useFetchBurnBlock(): (
  heightOrHash: string | number
) => Promise<BurnBlock | undefined> {
  const api = useApi();
  const queryClient = useQueryClient();

  return async (heightOrHash: string | number) => {
    const queryKey = [BURN_BLOCKS_QUERY_KEY, heightOrHash];

    const cachedData = queryClient.getQueryData<BurnBlock>(queryKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch the data and update the cache
    const fetchBurnBlock = async (): Promise<BurnBlock | undefined> => {
      return api.burnBlocksApi.getBurnBlock({ heightOrHash }).catch(() => undefined);
    };

    return queryClient.fetchQuery<BurnBlock | undefined>({
      queryKey,
      queryFn: fetchBurnBlock,
      staleTime: Infinity,
    });
  };
}

export function useFetchMultipleBurnBlocks(): (
  heightOrHashes: (string | number)[]
) => Promise<BurnBlock[]> {
  const fetchBurnBlock = useFetchBurnBlock();

  return async (heightOrHashes: (string | number)[]) => {
    const burnBlockPromises = heightOrHashes.map(heightOrHash => fetchBurnBlock(heightOrHash));

    return (await Promise.all(burnBlockPromises).then(burnBlocks =>
      burnBlocks.filter(Boolean)
    )) as BurnBlock[];
  };
}

export function useGetBurnBlockQuery() {
  const api = useApi();
  return (heightOrHash: string | number) => ({
    queryKey: [BURN_BLOCKS_QUERY_KEY, heightOrHash],
    queryFn: () =>
      api.burnBlocksApi.getBurnBlock({
        heightOrHash,
      }),
    cacheTime: 15 * 60 * 1000,
  });
}

export function useBurnBlock(
  heightOrHash: number | string,
  options: any = {}
): UseQueryResult<BurnBlock> {
  const api = useApi();
  return useQuery({
    queryKey: ['burn-block', heightOrHash],
    queryFn: () =>
      api.burnBlocksApi
        .getBurnBlock({
          heightOrHash,
        })
        .catch(() => undefined),
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
    queryFn: () => api.burnBlocksApi.getBurnBlock({ heightOrHash }).catch(() => undefined),
    staleTime: Infinity,
    ...options,
  });
}
