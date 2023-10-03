import { useMemo } from 'react';
import { UseInfiniteQueryResult } from '@tanstack/react-query';

interface GenericResponseType<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}

export function useInfiniteQueryResult<T>(
  response: UseInfiniteQueryResult<GenericResponseType<unknown>>,
  limit?: number
) {
  return useMemo(
    () =>
      (response.data?.pages
        .map(page => page.results)
        .flat()
        .slice(0, limit) || []) as T[],
    [limit, response.data?.pages]
  );
}
