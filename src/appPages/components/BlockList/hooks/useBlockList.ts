import { useInfiniteQuery } from '@tanstack/react-query';
import { getNextPageParam } from '@/common/utils';
import { BlockQueryKeys } from '@/features/block/query-keys';
import { useHomeQueries } from '@/features/home/useHomeQueries';

export function useBlockList(limit: number) {
  const queries = useHomeQueries();
  const { data: blocks, ...actions } = useInfiniteQuery(
    [BlockQueryKeys.blocks],
    ({ pageParam }) => queries.fetchBlocks(limit, pageParam || 0)(),
    { getNextPageParam, refetchOnWindowFocus: true }
  );
  return { blocks, actions };
}
