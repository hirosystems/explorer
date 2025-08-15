import {
  UseInfiniteQueryOptions,
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { stacksAPIFetch } from '../../../api/stacksAPIFetch';
import { DEFAULT_LIST_LIMIT } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { GenericResponseType } from '../../../common/hooks/useInfiniteQueryResult';
import { TWO_MINUTES } from '../../../common/queries/query-stale-time';
import { getNextPageParam } from '../../../common/utils/utils';

export const BLOCKS_V2_QUERY_KEY = 'blocksV2Infinite';

export const useBlocksV2Infinite = (
  limit = DEFAULT_LIST_LIMIT,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    refetchOnMount?: boolean | 'always';
    refetchOnReconnect?: boolean | 'always';
    refetchOnWindowFocus?: boolean | 'always';
  }
) => {
  const { apiClient, activeNetwork } = useGlobalContext();
  return useInfiniteQuery({
    queryKey: [BLOCKS_V2_QUERY_KEY, limit, activeNetwork.url],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam || 0;
      const url = `${activeNetwork.url}/extended/v2/blocks/?limit=${limit}&offset=${offset}`;
      const response = await stacksAPIFetch(url);
      const data = await response.json();
      return data as GenericResponseType<Block>;
    },
    staleTime: options?.staleTime ?? TWO_MINUTES,
    gcTime: options?.gcTime,
    enabled: options?.enabled,
    refetchOnMount: options?.refetchOnMount,
    refetchOnReconnect: options?.refetchOnReconnect,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
    getNextPageParam,
    initialPageParam: 0,
  });
};

export const useBlocksV2List = (
  limit = DEFAULT_LIST_LIMIT,
  options?: any
): UseQueryResult<GenericResponseType<Block>> => {
  const { apiClient, activeNetwork } = useGlobalContext();

  return useQuery({
    queryKey: [BLOCKS_V2_QUERY_KEY, limit, activeNetwork.url],
    queryFn: async () => {
      const url = `${activeNetwork.url}/extended/v2/blocks/?limit=${limit}`;
      const response = await stacksAPIFetch(url);
      const data = await response.json();
      return data as GenericResponseType<Block>;
    },
    staleTime: TWO_MINUTES,
    ...options,
  });
};
