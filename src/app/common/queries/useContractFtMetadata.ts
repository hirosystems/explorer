import { useApi } from '@/common/api/client';
import { UseQueryOptions, useQuery } from 'react-query';

export const useContractFtMetadata = (
  api: ReturnType<typeof useApi>,
  { contractId }: { contractId: string },
  options: UseQueryOptions<any, any, any, any> = {}
) => {
  return useQuery(
    ['contractFtMetadata', contractId],
    () =>
      api.fungibleTokensApi.getContractFtMetadata({
        contractId,
      }),
    {
      retry: false,
      staleTime: Infinity,
      suspense: false,
      ...options,
    }
  );
};
