import { useApi } from '@/common/api/client';
import { DEFAULT_LIST_LIMIT } from '@/common/constants';
import { getNextPageParam } from '@/common/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

import { TWO_MINUTES } from './query-stale-time';

export const useMempoolTransactionsInfinite = (api: ReturnType<typeof useApi>) => {
  return useInfiniteQuery(
    ['mempoolTransactionsInfinite'],
    ({ pageParam }) =>
      api.transactionsApi.getMempoolTransactionList({
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    // new Promise(function (resolve) {
    //   setTimeout(() => resolve([]), 1000000);
    // }),
    {
      getNextPageParam,
      staleTime: TWO_MINUTES,
      refetchOnMount: false,
      retry: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );
};
