import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { InfiniteData, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useAddressMempoolTxsInfinite(
  address?: string,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<MempoolTransaction>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['addressMempoolTxsInfinite', address],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getMempoolTransactionList({
        address,
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    enabled: !!address,
    ...options,
  });
}
export function useSuspenseAddressMempoolTxsInfinite(
  address?: string,
  options: any = {}
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<MempoolTransaction>>> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['addressMempoolTxsInfinite', address],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getMempoolTransactionList({
        address,
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
