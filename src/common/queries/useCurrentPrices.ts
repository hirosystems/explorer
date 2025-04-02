'use client';

import { QueryFunctionContext, UseQueryOptions } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useGlobalContext';

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
  const { tokenPrice } = useGlobalContext();
  const blockBurnTimeDate = blockBurnTime?.split('T')[0];
  if (!blockBurnTime) {
    return {
      data: tokenPrice.stxPrice,
      isLoading: false,
      error: null,
    };
  }

  return {
    data: 0,
    isLoading: false,
    error: null,
  };
};
