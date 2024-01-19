import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client/dist/api';
import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import axios from 'axios';

import { useApi } from '../api/useApi';
import { useGlobalContext } from '../context/useAppContext';

export function useFtMetadata(
  contractId?: string,
  options: any = {}
): UseQueryResult<FtMetadataResponse> {
  const api = useApi();
  return useQuery({
    queryKey: ['ft-metadata', contractId],
    queryFn: () => api.tokenMetadataApi?.getFtMetadata(contractId!),
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
  const api = useApi();
  const basePath = useGlobalContext().activeNetworkKey;
  console.log({ basePath });

  // Modified query function with try-catch for error handling
  async function fetchMetadata() {
    try {
      // return await api.tokenMetadataApi?.getFtMetadata(contractId);
      const result = await axios.get(`${basePath}/metadata/v1/ft/${contractId}}`);
      console.log({ result });
      return result.data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      // Handle the error as needed, e.g., return null or a default object
      return null;
    }
  }

  return useSuspenseQuery({
    queryKey: ['ft-metadata', contractId],
    queryFn: fetchMetadata,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    ...options,
  });

  // const api = useApi();
  // return useSuspenseQuery({
  //   queryKey: ['ft-metadata', contractId],
  //   queryFn: async () => {
  //     try {
  //       return await api.tokenMetadataApi?.getFtMetadata(contractId);
  //     } catch (e) {
  //       console.log('i have caught the error! in useSuspenseFtMetadata');
  //       // throw e;
  //       return null;
  //     }
  //   },
  //   retry: false,
  //   staleTime: Infinity,
  //   refetchOnWindowFocus: false,
  //   ...options,
  // });
}
