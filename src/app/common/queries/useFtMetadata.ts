import { useApi } from '@/common/api/client';
import { UseQueryOptions, useQuery } from 'react-query';
import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';

export const useFtMetadata = (
  api: ReturnType<typeof useApi>,
  { contractId }: { contractId: string },
  options: UseQueryOptions<any, any, FtMetadataResponse, any> = {}
) => {
  return useQuery(
    ['contractFtMetadata', contractId],
    () => api.tokenMetadataApi?.getFtMetadata(contractId),
    {
      retry: false,
      staleTime: Infinity,
      suspense: false,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
