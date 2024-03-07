'use client';

import { QueryFunctionContext, UseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';

const getHistoricalStxPrice = async ({ queryKey }: QueryFunctionContext) => {
  const [_, blockBurnTime] = queryKey;
  return fetch(`/stxPrice?blockBurnTime=${blockBurnTime}`)
    .then(res => res.json())
    .then(data => data?.price || 0);
};

export const useSuspenseStxPrice = (
  blockBurnTime?: string,
  options?: Partial<UseQueryOptions<any, unknown, any, string[]>>
) =>
  useSuspenseQuery({
    queryKey: ['stx-price', blockBurnTime || 'current'],
    queryFn: getHistoricalStxPrice,
    staleTime: blockBurnTime ? Infinity : 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    ...options,
  });
