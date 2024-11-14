import { useQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useGlobalContext';

export function useCoreApiInfo() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useQuery({
    queryKey: ['coreApiInfo'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/info`).then(res => res.json()),
  });
}
