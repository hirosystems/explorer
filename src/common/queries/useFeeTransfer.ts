import { useQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export function useFeeTransfer() {
  const api = useApi();
  return useQuery({
    queryKey: ['transfer-fees'],
    queryFn: () => api.feesApi.getFeeTransfer(),
  });
}
