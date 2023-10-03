import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';
import { Block } from '@stacks/stacks-blockchain-api-types';

export const useBlockByHash = (
  api: ReturnType<typeof useApi>,
  { hash }: { hash: string },
  options: UseQueryOptions<any, any, Block, any> = {}
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
