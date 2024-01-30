import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { address } from 'bitcoinjs-lib';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useApi } from '../api/useApi';
import { DEFAULT_BURN_BLOCKS_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useBurnBlocks(
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<BurnBlock>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['burnBlocks'],
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
  options: any = {}
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<BurnBlock>>> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['burnBlocks'],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.burnBlocksApi.getBurnBlocks({
        limit,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
