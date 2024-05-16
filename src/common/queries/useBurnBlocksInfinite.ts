import { BurnBlockWithTxCount } from '@/app/_components/BlockList/types';
import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useApi } from '../api/useApi';
import { DEFAULT_BURN_BLOCKS_LIMIT } from '../constants/constants';
import { useGlobalContext } from '../context/useAppContext';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export const BURN_BLOCKS_QUERY_KEY = 'burnBlocks';

// TODO: move code into useBurnBlocks
export function useBurnBlocks(
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<BurnBlock>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: [BURN_BLOCKS_QUERY_KEY],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.burnBlocksApi.getBurnBlocks({
        limit: DEFAULT_BURN_BLOCKS_LIMIT,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}

export function useSuspenseBurnBlocks(
  limit = DEFAULT_BURN_BLOCKS_LIMIT,
  options: any = {},
  queryKeyExtension?: string
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<BurnBlockWithTxCount>>> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: queryKeyExtension
      ? [BURN_BLOCKS_QUERY_KEY, queryKeyExtension]
      : [BURN_BLOCKS_QUERY_KEY],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return api.burnBlocksApi.getBurnBlocks({
        limit,
        offset: pageParam,
      });
    },
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}

export function useSuspenseBurnBlocks2(
  limit = DEFAULT_BURN_BLOCKS_LIMIT,
  options: any = {},
  queryKeyExtension?: string
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<BurnBlockWithTxCount>>> {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  const queryParameters = limit ? `?limit=${limit}` : '';
  return useSuspenseInfiniteQuery({
    queryKey: queryKeyExtension
      ? [BURN_BLOCKS_QUERY_KEY, queryKeyExtension]
      : [BURN_BLOCKS_QUERY_KEY],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetch(
        `${activeNetworkUrl}/extended/v2/burn-blocks${queryParameters}&offset=${pageParam}`
      ).then(res => res.json()),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
