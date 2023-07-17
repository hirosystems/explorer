import { useApi } from '@/common/api/client';
import { MAX_BLOCK_TRANSACTIONS_PER_CALL } from '@/common/constants';
import { getNextPageParam } from '@/common/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

import { TWO_MINUTES } from './query-stale-time';

export const useBlockTxsInfinite = (
  api: ReturnType<typeof useApi>,
  { blockHash }: { blockHash: string }
) => {
  return useInfiniteQuery(
    ['blockTxsInfinite', blockHash],
    ({ pageParam }) =>
      api.transactionsApi.getTransactionsByBlockHash({
        blockHash,
        limit: MAX_BLOCK_TRANSACTIONS_PER_CALL,
        offset: pageParam || 0,
      }),
    { getNextPageParam, staleTime: TWO_MINUTES }
  );
};
