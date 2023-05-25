import { useApi } from '@/common/api/client';
import { NftMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { UseQueryOptions, useQuery } from 'react-query';

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
      suspense: false,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
