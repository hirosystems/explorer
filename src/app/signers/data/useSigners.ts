import { useGlobalContext } from '@/common/context/useAppContext';
import { TEN_MINUTES } from '@/common/queries/query-stale-time';
import { useQuery } from '@tanstack/react-query';

export function useSigners(cycleId: number) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useQuery({
    queryKey: ['signers', cycleId],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/pox/cycles/${cycleId}/signers`).then(res => res.json()),
    staleTime: TEN_MINUTES,
  });
}
