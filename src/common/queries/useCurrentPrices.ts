'use client';

import {
  QueryFunctionContext,
  UseQueryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

const getCurrentBtcPrice = async () =>
  fetch('https://api.coingecko.com/api/v3/exchange_rates')
    .then(res => res.json())
    .then(data => data?.rates?.usd?.value || 0);

export const useCurrentBtcPrice = () =>
  useQuery({
    queryKey: ['current-btc-price'],
    queryFn: getCurrentBtcPrice,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });

const getCurrentStxPrice = async () =>
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack,bitcoin&vs_currencies=usd')
    .then(res => res.json())
    .then(data => data?.blockstack?.usd || 0);

export const useCurrentStxPrice = (options?: UseQueryOptions<any, unknown, any, any>) =>
  useQuery({
    queryKey: ['current-stx-price'],
    queryFn: getCurrentStxPrice,
    staleTime: 30 * 60 * 1000,
    retry: false,
    ...options,
  });

export const useSuspenseCurrentStxPrice = (options?: UseQueryOptions<any, unknown, any, any>) =>
  useSuspenseQuery({
    queryKey: ['current-stx-price'],
    queryFn: getCurrentStxPrice,
    staleTime: 30 * 60 * 1000,
    retry: false,
    ...options,
  });

const getHistoricalStxPrice = async ({ queryKey }: QueryFunctionContext) => {
  const [_, date] = queryKey;
  return fetch(
    `https://api.coingecko.com/api/v3/coins/blockstack/history?date=${date}&localization=false`
  )
    .then(res => res.json())
    .then(data => data?.market_data?.current_price?.usd || 0);
};

export const useSuspenseHistoricalStxPrice = (
  date: string,
  options?: Partial<UseQueryOptions<any, unknown, any, string[]>>
) =>
  useSuspenseQuery({
    queryKey: ['historical-stx-price', date],
    queryFn: getHistoricalStxPrice,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    ...options,
  });
