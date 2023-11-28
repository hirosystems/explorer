import { useSuspenseQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export const useSuspenseStxSupply = () => {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['stx-supply'],
    queryFn: () => api.infoApi.getStxSupply({}),
    staleTime: 30 * 60 * 1000,
  });
};
