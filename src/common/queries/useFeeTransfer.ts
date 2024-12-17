import { useQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useGlobalContext';

export function useFeeTransfer() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useQuery({
    queryKey: ['transfer-fees'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/fees/transfer`).then(res => res.json()),
  });
}
