import {
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';

import {
  AddressTransaction,
  AddressTransactionEvent,
  AddressTransactionWithTransfers,
} from '@stacks/stacks-blockchain-api-types';

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

export function useAddressTransactionEventsInfinite(
  address?: string,
  txId?: string,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<AddressTransactionEvent>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['addressConfirmedTxsWithTransfersInfinite', address, txId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getAddressTransactionEvents({
        address: address!,
        txId: txId!,
        limit: 5,
        offset: pageParam || 0,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    enabled: !!address && !!txId,
    ...options,
  });
}

export function useSuspenseAddressTransactionInfinite(
  address?: string,
  options: any = {}
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<AddressTransaction>>> {
  const api = useApi();
  if (!address) throw new Error('Address is required');
  return useSuspenseInfiniteQuery({
    queryKey: ['addressConfirmedTxsWithTransfersInfinite', address],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getAddressTransactions({
        address: address,
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    getNextPageParam,

    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
