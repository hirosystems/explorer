import { useApi } from '@/common/api/client';
import { DEFAULT_LIST_LIMIT } from '@/common/constants';
import { getNextPageParam } from '@/common/utils';
import { UseQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { TWO_MINUTES } from './query-stale-time';

export const useAddressMempoolTxsInfinite = (
  api: ReturnType<typeof useApi>,
  { address }: { address: string },
  options: UseQueryOptions<any, any, any, any> = {}
) => {
  return useInfiniteQuery(
    ['addressMempoolTxsInfinite', address],
    ({ pageParam }) =>
      api.transactionsApi.getMempoolTransactionList({
        address,
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    {
      getNextPageParam,
      staleTime: TWO_MINUTES,
      enabled: !!address,
      suspense: false,
      ...options,
    }
  );
};
