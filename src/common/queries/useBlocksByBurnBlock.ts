import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';

import { useApi } from '../api/useApi';
import { DEFAULT_BURN_BLOCKS_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { ONE_SECOND, TWO_MINUTES } from './query-stale-time';

export function useBlocksByBurnBlock(
  heightOrHash: string | number,
  limit: number,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<NakamotoBlock>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['getBlocksByBurnBlock', heightOrHash],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlocksByBurnBlock({
        heightOrHash,
        limit,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: heightOrHash === 'latest' ? ONE_SECOND * 5 : TWO_MINUTES,
    ...options,
  });
}

export function useSuspenseBlocksByBurnBlock(
  heightOrHash: string | number,
  limit: number,
  options: any = {}
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<NakamotoBlock>>> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['getBlocksByBurnBlock', heightOrHash],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.blocksApi.getBlocksByBurnBlock({
        heightOrHash,
        limit,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: heightOrHash === 'latest' ? ONE_SECOND * 5 : TWO_MINUTES,
    ...options,
  });
}
