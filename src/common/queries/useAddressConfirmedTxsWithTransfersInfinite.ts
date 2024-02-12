import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

import { useState, useEffect } from 'react';

export function  useAllTransactions(address) {
  const api = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = async (pageParam = 0) => {
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
  };

  const fetchAllPages = async (pageParam = 0, accumulatedData = []) => {
    if (pageParam === undefined) {
      return accumulatedData;
    }
    try {
      const response = await fetchPage(pageParam);
      const nextPageParam = getNextPageParam(response);
      const newData = [...accumulatedData, ...response.results];
      return await fetchAllPages(nextPageParam, newData);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    fetchAllPages()
      .then((allData) => {
        setData(allData);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);

  return { data, loading, error };
};


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
