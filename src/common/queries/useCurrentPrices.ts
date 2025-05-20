'use client';

import { QueryFunctionContext, UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ONE_HOUR } from './query-stale-time';

const getHistoricalStxPrice = async ({ queryKey }: QueryFunctionContext) => {
  const [_, blockBurnTime] = queryKey;
  return fetch(`/stxPrice?blockBurnTime=${blockBurnTime}`)
    .then(res => res.json())
    .then(data => data?.price || 0);
};

export const useStxPrice = (
  blockBurnTime?: string,
  options?: Partial<UseQueryOptions<any, unknown, any, string[]>>
) => {
  const blockBurnTimeDate = blockBurnTime?.split('T')[0];
  return useQuery({
    queryKey: ['stx-price', blockBurnTimeDate ? blockBurnTime.split('T')[0] : 'current'],
    queryFn: getHistoricalStxPrice,
    staleTime: blockBurnTime ? Infinity : ONE_HOUR * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    ...options,
  });
};
