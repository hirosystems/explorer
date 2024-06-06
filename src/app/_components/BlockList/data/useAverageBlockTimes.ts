import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../../../../common/context/useAppContext';

const AVERAGE_BLOCK_TIMES_QUERY_KEY = '/extended/v2/blocks/average-times';

interface AverageBlockTimesResponse {
  last_1h: number;
  last_24h: number;
  last_7d: number;
  last_30d: number;
}

export function useSuspenseAverageBlockTimes(): UseSuspenseQueryResult<AverageBlockTimesResponse> {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useSuspenseQuery({
    queryKey: [AVERAGE_BLOCK_TIMES_QUERY_KEY],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v2/blocks/average-times`).then(res => res.json()),
    staleTime: 30 * 60 * 1000,
  });
}
