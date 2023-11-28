import { NftMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { UseQueryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export const useNftMetadata = (
  { contractId, tokenId }: { contractId?: string; tokenId?: number },
  options: Omit<UseQueryOptions<any, any, NftMetadataResponse, any>, 'queryKey' | 'queryFn'> = {}
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['nft-metadata', contractId, tokenId],
    queryFn: () => api.tokenMetadataApi?.getNftMetadata(contractId!, tokenId!),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!contractId && !!tokenId,
    ...options,
  });
};

export const useSuspenseNftMetadata = (
  { contractId, tokenId }: { contractId: string; tokenId: number },
  options: Omit<UseQueryOptions<any, any, NftMetadataResponse, any>, 'queryKey' | 'queryFn'> = {}
) => {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['nft-metadata', contractId, tokenId],
    queryFn: () => api.tokenMetadataApi?.getNftMetadata(contractId, tokenId),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    ...options,
  });
};
