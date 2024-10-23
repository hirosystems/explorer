import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

const ADDRESS_MEMPOOL_TXS_INFINITE_QUERY_KEY = 'addressMempoolTxsInfinite';

export function useAddressMempoolTxsInfinite(
  address?: string,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<MempoolTransaction>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: [ADDRESS_MEMPOOL_TXS_INFINITE_QUERY_KEY, address],
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
    queryKey: [ADDRESS_MEMPOOL_TXS_INFINITE_QUERY_KEY, address],
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
