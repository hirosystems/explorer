import { InfiniteData, UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { DEFAULT_LIST_LIMIT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { getNextPageParam } from '../utils/utils';
import { TWO_MINUTES } from './query-stale-time';
import { searchByBnsName } from './useSearchQuery';

export function useConfirmedTransactionsInfinite(
  {
    fromAddress,
    toAddress,
    startTime,
    endTime,
    order,
    sortBy,
  }: {
    fromAddress?: string;
    toAddress?: string;
    startTime?: number;
    endTime?: number;
    order?: 'asc' | 'desc' | undefined;
    sortBy?: string;
  } = {},
  options: any = {}
): UseInfiniteQueryResult<InfiniteData<GenericResponseType<Transaction>>> {
  const apiClient = useApiClient();
  return useInfiniteQuery({
    queryKey: [
      'confirmedTransactionsInfinite',
      fromAddress,
      toAddress,
      startTime,
      endTime,
      order,
      sortBy,
    ],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (fromAddress?.endsWith('.btc')) {
        fromAddress =
          (await searchByBnsName(apiClient, fromAddress))?.result.entity_id || fromAddress;
      }
      if (toAddress?.endsWith('.btc')) {
        toAddress = (await searchByBnsName(apiClient, toAddress))?.result.entity_id || toAddress;
      }

      return await callApiWithErrorHandling(apiClient, '/extended/v1/tx/', {
        params: {
          query: {
            limit: DEFAULT_LIST_LIMIT,
            offset: pageParam,
            ...(fromAddress && { from_address: fromAddress }),
            ...(toAddress && { to_address: toAddress }),
            ...(startTime && { start_time: Number(startTime) }),
            ...(endTime && { end_time: Number(endTime) }),
            ...(sortBy && {
              sort_by: sortBy as 'block_height' | 'burn_block_time' | 'fee' | undefined,
            }),
            order,
          },
        },
      });
    },
    initialPageParam: 0,
    getNextPageParam,
    staleTime: TWO_MINUTES,
    refetchOnWindowFocus: true,
    ...options,
  });
}
