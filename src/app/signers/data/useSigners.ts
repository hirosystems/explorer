import { useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { TEN_MINUTES } from '../../../common/queries/query-stale-time';
import { ApiResponseWithResultsOffset } from '../../../common/types/api';

export interface SignerInfo {
  signing_key: string;
  weight: number;
  stacked_amount: string;
  weight_percent: number;
  stacked_amount_percent: number;
  pooled_stacker_count: number;
  solo_stacker_count: number;
}
export function useSuspensePoxSigners(cycleId: string) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<
    ApiResponseWithResultsOffset<SignerInfo>,
    Error,
    ApiResponseWithResultsOffset<SignerInfo>
  >({
    queryKey: ['signers', cycleId],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v2/pox/cycles/${cycleId}/signers`).then(
        res => res.json() as Promise<ApiResponseWithResultsOffset<SignerInfo>>
      ),
    staleTime: TEN_MINUTES,
  });
}
