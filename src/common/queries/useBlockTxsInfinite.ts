import {
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { MAX_BLOCK_TRANSACTIONS_PER_CALL } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useBlockTxsInfinite(
  blockHash?: string,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<Transaction>>> {
  const api = useApi();
  return useInfiniteQuery({
    queryKey: ['blockTxsInfinite', blockHash],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getTransactionsByBlockHash({
        blockHash: blockHash!,
        limit: MAX_BLOCK_TRANSACTIONS_PER_CALL,
        offset: pageParam || 0,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    enabled: !!blockHash,
    ...options,
  });
}

export function useSuspenseBlockTxsInfinite(
  blockHash: string,
  options: any = {}
): UseSuspenseInfiniteQueryResult<InfiniteData<GenericResponseType<Transaction>>> {
  const api = useApi();
  return useSuspenseInfiniteQuery({
    queryKey: ['blockTxsInfinite', blockHash],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      api.transactionsApi.getTransactionsByBlockHash({
        blockHash,
        limit: MAX_BLOCK_TRANSACTIONS_PER_CALL,
        offset: pageParam || 0,
      }),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
