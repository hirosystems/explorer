import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { useGlobalContext } from '../context/useGlobalContext';

export const BURN_BLOCKS_QUERY_KEY = 'burnBlocks';

export const getBurnBlockQueryKey = (heightOrHash: string | number, activeNetworkKey: string) => [
  'burn-block',
  heightOrHash,
  activeNetworkKey,
];

export function useFetchBurnBlock(): (
  heightOrHash: string | number
) => Promise<BurnBlock | undefined> {
  const apiClient = useApiClient();
  const { activeNetworkKey } = useGlobalContext();
  const queryClient = useQueryClient();

  return async (heightOrHash: string | number) => {
    const queryKey = getBurnBlockQueryKey(heightOrHash, activeNetworkKey);

    const cachedData = queryClient.getQueryData<BurnBlock>(queryKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch the data and update the cache
    const fetchBurnBlock = async () => {
      if (!heightOrHash) return undefined;
      return await callApiWithErrorHandling(
        apiClient,
        '/extended/v2/burn-blocks/{height_or_hash}',
        {
          params: { path: { height_or_hash: heightOrHash } },
        }
      );
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

export function useBurnBlock(
  heightOrHash: number | string,
  options: any = {}
): UseQueryResult<BurnBlock> {
  const apiClient = useApiClient();
  const { activeNetworkKey } = useGlobalContext();
  return useQuery({
    queryKey: getBurnBlockQueryKey(heightOrHash, activeNetworkKey),
    queryFn: async () => {
      if (!heightOrHash) return undefined;
      return await callApiWithErrorHandling(
        apiClient,
        '/extended/v2/burn-blocks/{height_or_hash}',
        {
          params: { path: { height_or_hash: heightOrHash } },
        }
      );
    },
    staleTime: Infinity,
    ...options,
  });
}

export function useSuspenseBurnBlock(
  heightOrHash: number | string,
  options: any = {}
): UseSuspenseQueryResult<BurnBlock> {
  const apiClient = useApiClient();
  const { activeNetworkKey } = useGlobalContext();
  return useSuspenseQuery({
    queryKey: getBurnBlockQueryKey(heightOrHash, activeNetworkKey),
    queryFn: async () => {
      if (!heightOrHash) return undefined;
      return await callApiWithErrorHandling(
        apiClient,
        '/extended/v2/burn-blocks/{height_or_hash}',
        {
          params: { path: { height_or_hash: heightOrHash } },
        }
      );
    },
    staleTime: Infinity,
    ...options,
  });
}
