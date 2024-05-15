import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useAppContext';

export function usePoxInfoRaw() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useQuery({
    queryKey: ['pox-info-raw'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/pox`).then(res => res.json()),
    staleTime: 30 * 60 * 1000,
    enabled: !!activeNetworkUrl,
  });
}
export function useSuspensePoxInfoRaw() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useSuspenseQuery({
    queryKey: ['pox-info-raw'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/pox`).then(res => res.json()),
    staleTime: 30 * 60 * 1000,
  });
}
