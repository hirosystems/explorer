import { QueryFunctionContext, useQuery, UseQueryOptions } from '@tanstack/react-query';

const getCurrentBtcPrice = async () =>
  fetch('https://api.coingecko.com/api/v3/exchange_rates')
    .then(res => res.json())
    .then(data => data?.rates?.usd?.value);

export const useCurrentBtcPrice = () =>
  useQuery(['current-btc-price'], getCurrentBtcPrice, {
    staleTime: 30 * 60 * 1000,

    retry: false,
  });

const getCurrentStxPrice = async () =>
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack,bitcoin&vs_currencies=usd')
    .then(res => res.json())
    .then(data => data?.blockstack?.usd);

export const useCurrentStxPrice = (options?: UseQueryOptions<any, unknown, number, any>) =>
  useQuery(['current-stx-price'], getCurrentStxPrice, {
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
    .then(data => data?.market_data?.current_price?.usd);
};

export const useHistoricalStxPrice = (
  date: string,
  options?: UseQueryOptions<any, unknown, number, string[]>
) =>
  useQuery(['historical-stx-price', date], getHistoricalStxPrice, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

    retry: false,
    ...options,
  });
