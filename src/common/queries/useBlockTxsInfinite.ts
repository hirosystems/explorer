import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { MAX_BLOCK_TRANSACTIONS_PER_CALL } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';

export function useBlockTxsInfinite(
  blockHash?: string,
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<Transaction>>> {
  const apiClient = useApiClient();
  return useInfiniteQuery({
    queryKey: ['blockTxsInfinite', blockHash],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (!blockHash) return undefined;
      return await callApiWithErrorHandling(apiClient, '/extended/v1/tx/block/{block_hash}', {
        params: {
          path: { block_hash: blockHash },
          query: { limit: MAX_BLOCK_TRANSACTIONS_PER_CALL, offset: pageParam || 0 },
        },
      });
    },
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
  const apiClient = useApiClient();
  return useSuspenseInfiniteQuery({
    queryKey: ['blockTxsInfinite', blockHash],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (!blockHash) return undefined;
      return await callApiWithErrorHandling(apiClient, '/extended/v1/tx/block/{block_hash}', {
        params: {
          path: { block_hash: blockHash },
          query: { limit: MAX_BLOCK_TRANSACTIONS_PER_CALL, offset: pageParam || 0 },
        },
      });
    },
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}
