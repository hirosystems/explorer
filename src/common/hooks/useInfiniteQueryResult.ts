import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useMemo } from 'react';

export interface GenericResponseType<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}

export function useInfiniteQueryResult<T>(
  response: UseInfiniteQueryResult<InfiniteData<GenericResponseType<T>>>,
  limit?: number
) {
  return useMemo(
    () =>
      response.data?.pages
        .map(page => page.results)
        .flat()
        .slice(0, limit) || [],
    [limit, response.data?.pages]
  );
}

export function useSuspenseInfiniteQueryResult<T>(
  response: UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<T>>>,
  limit?: number
) {
  return useMemo(
    () =>
      response.data?.pages
        .map(page => page.results)
        .flat()
        .slice(0, limit) || [],
    [limit, response.data?.pages]
  );
}
