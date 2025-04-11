'use client';

import { FtBasicMetadataResponse } from '@hirosystems/token-metadata-api-client';
import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { useMetadataApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { FIVE_MINUTES } from './query-stale-time';

export const useFtTokens = (
  {
    name,
    symbol,
    address,
    order_by,
    order,
  }: {
    name?: string;
    symbol?: string;
    address?: string;
    order_by?: any;
    order?: any;
  },
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<FtBasicMetadataResponse>>> => {
  const tokenMetadataApi = useMetadataApi();
  return useInfiniteQuery({
    queryKey: ['ftTokens', name, symbol, address, order_by, order],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      tokenMetadataApi?.getFungibleTokens(
        name,
        symbol,
        address,
        pageParam,
        DEFAULT_LIST_LIMIT,
        order_by,
        order
      ),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: FIVE_MINUTES,
    ...options,
  });
};

export const useSuspenseFtTokens = (
  {
    name,
    symbol,
    address,
    order_by,
    order,
  }: {
    name?: string;
    symbol?: string;
    address?: string;
    order_by?: any;
    order?: any;
  },
  options: any = {}
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<FtBasicMetadataResponse>>> => {
  const tokenMetadataApi = useMetadataApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['ftTokens', name, symbol, address, order_by, order],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      tokenMetadataApi?.getFungibleTokens(
        name,
        symbol,
        address,
        pageParam,
        DEFAULT_LIST_LIMIT,
        order_by,
        order,
        {
          query: {
            valid_metadata_only: true,
          },
        }
      ),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: FIVE_MINUTES,
    ...options,
  });
};
