import { useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';
import { DEFAULT_LIST_LIMIT } from '@/common/constants';
import { getNextPageParam } from '@/common/utils';
import { FIVE_MINUTES } from '@/appPages/common/queries/query-stale-time';

export const useFtTokens = (
  {
    name,
    symbol,
    address,
    order_by,
    order,
  }: {
    name?: string;
    symbol?: string;
    address?: string;
    order_by?: any;
    order?: any;
  },
  options: UseQueryOptions<any, any, any, any> = {}
) => {
  const { tokenMetadataApi } = useApi();
  return useInfiniteQuery(
    ['ftTokens', name, symbol, address, order_by, order],
    async ({ pageParam }) => {
      return tokenMetadataApi?.getFungibleTokens(
        name,
        symbol,
        address,
        pageParam || 0,
        DEFAULT_LIST_LIMIT,
        order_by,
        order
      );
    },
    {
      getNextPageParam,
      staleTime: FIVE_MINUTES,
      ...options,
    }
  );
};
