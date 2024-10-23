import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { TEN_MINUTES } from '../../../common/queries/query-stale-time';
import { ApiResponseWithResultsOffset } from '../../../common/types/api';

export interface PoxSigner {
  signing_key: string;
  weight: number;
  stacked_amount: string;
  weight_percent: number;
  stacked_amount_percent: number;
  pooled_stacker_count: number;
  solo_stacker_count: number;
}

const DEFAULT_LIST_LIMIT = 100;

const POX_SIGNERS_QUERY_KEY = 'pox-signers';

const fetchPoxSigners = async (
  apiUrl: string,
  cycleId: number,
  pageParam: number,
  options: { limit?: number; offset?: number }
): Promise<ApiResponseWithResultsOffset<PoxSigner>> => {
  const limit = options.limit || DEFAULT_LIST_LIMIT;
  const offset = pageParam || 0;
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  }).toString();
  const response = await fetch(
    `${apiUrl}/extended/v2/pox/cycles/${cycleId}/signers${queryString ? `?${queryString}` : ''}`
  );
  return response.json();
};

export function useSuspensePoxSigners(
  cycleId: number,
  options: { limit?: number; offset?: number } = {}
) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseInfiniteQuery<ApiResponseWithResultsOffset<PoxSigner>>({
    queryKey: [POX_SIGNERS_QUERY_KEY, cycleId],
    queryFn: ({ pageParam = 0 }) =>
      fetchPoxSigners(activeNetworkUrl, cycleId, pageParam as number, options),
    staleTime: TEN_MINUTES,
    getNextPageParam: (lastPage, pages) => lastPage.offset + lastPage.limit,
    initialPageParam: 0,
    ...options,
  });
}
