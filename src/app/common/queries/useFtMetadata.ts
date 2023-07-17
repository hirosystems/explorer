import { useApi } from '@/common/api/client';
import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

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
