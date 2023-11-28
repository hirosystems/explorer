import { useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useAppContext';

export function useSuspensePoxInforRaw() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useSuspenseQuery({
    queryKey: ['pox-info-raw'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/pox`).then(res => res.json()),
    staleTime: 30 * 60 * 1000,
  });
}
