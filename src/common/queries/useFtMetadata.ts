import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client/dist/api';
import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useMetadataApi } from '../api/useApi';

export function useFtMetadata(
  contractId?: string,
  options: any = {}
): UseQueryResult<FtMetadataResponse> {
  const tokenMetadataApi = useMetadataApi();
  return useQuery({
    queryKey: ['ft-metadata', contractId],
    queryFn: () => tokenMetadataApi?.getFtMetadata(contractId!),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!contractId,
    ...options,
  });
}

export function useSuspenseFtMetadata(
  contractId: string,
  options: any = {}
): UseSuspenseQueryResult<FtMetadataResponse> {
  const tokenMetadataApi = useMetadataApi();
  return useSuspenseQuery({
    queryKey: ['ft-metadata', contractId],
    queryFn: () => tokenMetadataApi?.getFtMetadata(contractId),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    ...options,
  });
}
