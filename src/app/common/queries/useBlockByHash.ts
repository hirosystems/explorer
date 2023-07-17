import { useApi } from '@/common/api/client';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export const useBlockByHash = (
  api: ReturnType<typeof useApi>,
  { hash }: { hash: string },
  options: UseQueryOptions<any, any, any, any> = {}
) => {
  return useQuery(
    ['blockByHash', hash],
    () =>
      api.blocksApi.getBlockByHash({
        hash,
      }),
    { staleTime: Infinity, ...options }
  );
};
