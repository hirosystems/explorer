import { useApi } from '@/common/api/client';
import { UseQueryOptions, useQuery } from 'react-query';

export const useFtMetadata = (
  api: ReturnType<typeof useApi>,
  { contractId }: { contractId: string },
  options: UseQueryOptions<any, any, any, any> = {}
) => {
  return useQuery(
    ['contractFtMetadata', contractId],
    () => api.tokenMetadataApi.getFtMetadata(contractId),
    {
      retry: false,
      staleTime: Infinity,
      suspense: false,
      ...options,
    }
  );
};
