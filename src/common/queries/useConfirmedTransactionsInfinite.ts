import {
  UseInfiniteQueryResult,
  UseQueryOptions,
  UseSuspenseInfiniteQueryResult,
  UseSuspenseQueryOptions,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';

import {
  GetTransactionListOrderEnum,
  GetTransactionListSortByEnum,
} from '@stacks/blockchain-api-client';
import { Block, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';
import { searchByBnsName } from './useSearchQuery';

export function useConfirmedTransactionsInfinite(
  {
    fromAddress,
    toAddress,
    startTime,
    endTime,
    order,
    sortBy,
  }: {
    fromAddress?: string;
    toAddress?: string;
    startTime?: number;
    endTime?: number;
    order?: GetTransactionListOrderEnum;
    sortBy?: GetTransactionListSortByEnum;
  } = {},
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<Transaction>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: [
      'confirmedTransactionsInfinite',
      fromAddress,
      toAddress,
      startTime,
      endTime,
      order,
      sortBy,
    ],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (fromAddress?.endsWith('.btc')) {
        fromAddress = (await searchByBnsName(api, fromAddress))?.result.entity_id || fromAddress;
      }
      if (toAddress?.endsWith('.btc')) {
        toAddress = (await searchByBnsName(api, toAddress))?.result.entity_id || toAddress;
      }
      return api.transactionsApi.getTransactionList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam,
        fromAddress,
        toAddress,
        startTime,
        endTime,
        order,
        sortBy,
      });
    },
    initialPageParam: 0,
    getNextPageParam,
    staleTime: TWO_MINUTES,
    refetchOnWindowFocus: true,
    ...options,
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
