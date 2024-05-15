import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export const useStxSupply = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['stx-supply'],
    queryFn: () => api.infoApi.getStxSupply({}),
    staleTime: 30 * 60 * 1000,
  });
};

export const useSuspenseStxSupply = () => {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['stx-supply'],
    queryFn: () => api.infoApi.getStxSupply({}),
    staleTime: 30 * 60 * 1000,
  });
};
