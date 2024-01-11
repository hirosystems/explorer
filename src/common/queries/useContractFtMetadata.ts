import { useQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export function useContractFtMetadata(contractId?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['contract-ft-metadata', contractId],
    queryFn: () => api.tokenMetadataApi?.getFtMetadata(contractId!),
    enabled: !!contractId,
  });
}
