import {
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';

import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useAddressConfirmedTxsWithTransfersInfinite(
  address?: string,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<AddressTransactionWithTransfers>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['addressConfirmedTxsWithTransfersInfinite', address],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.accountsApi.getAccountTransactionsWithTransfers({
        principal: address!,
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    enabled: !!address,
    ...options,
  });
}

export function useSuspenseAddressConfirmedTxsWithTransfersInfinite(
  address?: string,
  options: any = {}
): UseSuspenseInfiniteQueryResult<
  InfiniteData<GenericResponseType<AddressTransactionWithTransfers>>
> {
  const api = useApi();
  if (!address) throw new Error('Address is required');
  return useSuspenseInfiniteQuery({
    queryKey: ['addressConfirmedTxsWithTransfersInfinite', address],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.accountsApi.getAccountTransactionsWithTransfers({
        principal: address,
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
