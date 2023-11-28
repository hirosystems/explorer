import { UseSuspenseInfiniteQueryResult, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useSuspenseMempoolTransactionsInfinite(): UseSuspenseInfiniteQueryResult<
  InfiniteData<GenericResponseType<MempoolTransaction>>
> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['mempoolTransactionsInfinite'],
    queryFn: ({ pageParam }) =>
      api.transactionsApi.getMempoolTransactionList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    refetchOnMount: false,
    retry: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
}
