import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useFetchAllTransactions() {
  const api = useApi();

  const fetchPage = useCallback(
    async (address: string, pageParam: number = 0) => {
      try {
        const response = await api.accountsApi.getAccountTransactionsWithTransfers({
          principal: address,
          limit: DEFAULT_LIST_LIMIT,
          offset: pageParam,
        });
        return response;
      } catch (err) {
        throw err;
      }
    },
    [api]
  );

  const fetchAllPages = useCallback(
    async (address: string, pageParam: number | undefined, accumulatedData: AddressTransactionWithTransfers[] = []) => {
      console.log('fetchAllPages', {address, pageParam, accumulatedData})
      if (pageParam === undefined) {
        return accumulatedData;
      }
      try {
        const response = await fetchPage(address, pageParam);
        const nextPageParam = getNextPageParam(response);
        const newData = [...accumulatedData, ...response.results];
        return await fetchAllPages(address, nextPageParam, newData as any); // TODO: fix typing
      } catch (err) {
        throw err;
      }
    },
    [fetchPage]
  );

  return fetchAllPages;
}

export function useFetchAddressConfirmedTxsWithTransfers(): (
  address: string
) => Promise<GenericResponseType<AddressTransactionWithTransfers>> {
  const api = useApi();

  const fetchAddressConfirmedTxsWithTransfers = async (address: string) => {
    return api.accountsApi.getAccountTransactionsWithTransfers({
      principal: address,
      limit: MAX_LIST_LIMIT,
      offset: 0,
    }) as Promise<GenericResponseType<AddressTransactionWithTransfers>>;
  };

  return fetchAddressConfirmedTxsWithTransfers;
}

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
