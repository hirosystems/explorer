import {
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useConfirmedTransactionsInfinite({
  fromAddress,
  toAddress,
  startTime,
  endTime,
}: {
  fromAddress?: string;
  toAddress?: string;
  startTime?: number;
  endTime?: number;
} = {}): UseInfiniteQueryResult<InfiniteData<GenericResponseType<Transaction>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['confirmedTransactionsInfinite'],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getTransactionList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam,
        fromAddress,
        toAddress,
        startTime,
        endTime,
      }),
    initialPageParam: 0,
    getNextPageParam,
    staleTime: TWO_MINUTES,
    refetchOnWindowFocus: true,
  });
}

export function useSuspenseConfirmedTransactionsInfinite(): UseSuspenseInfiniteQueryResult<
  InfiniteData<GenericResponseType<Transaction>>
> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['confirmedTransactionsInfinite'],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getTransactionList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam,
    staleTime: TWO_MINUTES,
    refetchOnWindowFocus: true,
  });
}
