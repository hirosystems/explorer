import { NftMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { useMetadataApi } from '../api/useApi';

export const useNftMetadata = (
  { contractId, tokenId }: { contractId?: string; tokenId?: number },
  options: Omit<UseQueryOptions<any, any, NftMetadataResponse, any>, 'queryKey' | 'queryFn'> = {}
) => {
  const tokenMetadataApi = useMetadataApi();
  return useQuery({
    queryKey: ['nft-metadata', contractId, tokenId],
    queryFn: () => tokenMetadataApi?.getNftMetadata(contractId!, tokenId!),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!contractId && tokenId !== undefined && tokenId !== null,
    ...options,
  });
};
