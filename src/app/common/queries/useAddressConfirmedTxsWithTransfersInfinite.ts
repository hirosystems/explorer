import { useApi } from '@/common/api/client';
import { DEFAULT_LIST_LIMIT } from '@/common/constants';
import { getNextPageParam } from '@/common/utils';
import { UseQueryOptions, useInfiniteQuery } from 'react-query';

import { TWO_MINUTES } from './query-stale-time';

export const useAddressConfirmedTxsWithTransfersInfinite = (
  api: ReturnType<typeof useApi>,
  { address = '' }: { address?: string },
  options: UseQueryOptions<any, any, any, any> = {}
) => {
  return useInfiniteQuery(
    ['addressConfirmedTxsWithTransfersInfinite', address],
    ({ pageParam }) =>
      api.accountsApi.getAccountTransactionsWithTransfers({
        principal: address,
        limit: DEFAULT_LIST_LIMIT,
        offset: pageParam || 0,
      }),
    {
      getNextPageParam,
      staleTime: TWO_MINUTES,
      enabled: !!address,
      ...options,
    }
  );
};
