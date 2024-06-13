import { useApi } from '@/common/api/useApi';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

const AVERAGE_BLOCK_TIMES_QUERY_KEY = '/extended/v2/blocks/average-times';

interface AverageBlockTimesResponse {
  last_1h: number;
  last_24h: number;
  last_7d: number;
  last_30d: number;
}

export function useSuspenseAverageBlockTimes(): UseSuspenseQueryResult<AverageBlockTimesResponse> {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: [AVERAGE_BLOCK_TIMES_QUERY_KEY],
    queryFn: () => api.blocksApi.getAverageBlockTimes(),
    staleTime: 30 * 60 * 1000,
  });
}
