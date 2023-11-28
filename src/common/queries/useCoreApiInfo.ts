import { useQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export function useCoreApiInfo() {
  const api = useApi();
  return useQuery({
    queryKey: ['coreApiInfo'],
    queryFn: () => api.infoApi.getCoreApiInfo(),
  });
}
