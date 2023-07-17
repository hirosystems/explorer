import { useApi } from '@/common/api/client';
import { DEFAULT_LIST_LIMIT } from '@/common/constants';
import { getNextPageParam } from '@/common/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

import { TWO_MINUTES } from './query-stale-time';

export const useConfirmedTransactionsInfinite = (
  api: ReturnType<typeof useApi>,
  wait?: boolean
) => {
  return useInfiniteQuery(
    ['confirmedTransactionsInfinite'],
    ({ pageParam }) =>
      api.transactionsApi.getTransactionList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    { getNextPageParam, staleTime: TWO_MINUTES }
  );
};
