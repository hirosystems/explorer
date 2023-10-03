import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';

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

      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
