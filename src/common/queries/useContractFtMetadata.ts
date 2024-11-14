import { useQuery } from '@tanstack/react-query';

import { useMetadataApi } from '../api/useApi';

export function useContractFtMetadata(contractId?: string) {
  const tokenMetadataApi = useMetadataApi();
  return useQuery({
    queryKey: ['contract-ft-metadata', contractId],
    queryFn: () => tokenMetadataApi?.getFtMetadata(contractId!),
    enabled: !!contractId,
  });
}
