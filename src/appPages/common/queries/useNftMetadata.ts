import { NftMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';

export const useNftMetadata = (
  api: ReturnType<typeof useApi>,
  { contractId, tokenId }: { contractId: string; tokenId: number },
  options: UseQueryOptions<any, any, NftMetadataResponse, any> = {}
) => {
  return useQuery(
    ['contractNftMetadata', contractId, tokenId],
    () => api.tokenMetadataApi?.getNftMetadata(contractId, tokenId),
    {
      retry: false,
      staleTime: Infinity,

      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
