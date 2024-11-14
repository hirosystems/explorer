import { useGlobalContext } from '@/common/context/useGlobalContext';
import { useQuery } from '@tanstack/react-query';

export function useFeeTransfer() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useQuery({
    queryKey: ['transfer-fees'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/fees/transfer`).then(res => res.json()),
  });
}
