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

export type ResponseType<T, R extends GenericResponseType<T> = GenericResponseType<T>> = R;

export function useInfiniteQueryResult<
  T,
  R extends GenericResponseType<T> = GenericResponseType<T>,
>(response: UseInfiniteQueryResult<InfiniteData<ResponseType<T, R>>>, limit?: number) {
  return useMemo(
    () =>
      response.data?.pages
        .map(page => page.results)
        .flat()
        .slice(0, limit) || [],
    [limit, response.data?.pages]
  );
}

export function useSuspenseInfiniteQueryResult<
  T,
  R extends GenericResponseType<T> = GenericResponseType<T>,
>(response: UseSuspenseInfiniteQueryResult<InfiniteData<ResponseType<T, R>>>, limit?: number) {
  return useMemo(() => {
    return (
      response.data?.pages
        .map(page => page.results)
        .flat()
        .slice(0, limit) || []
    );
  }, [limit, response.data?.pages]);
}
