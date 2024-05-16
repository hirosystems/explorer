import { useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../../../common/context/useAppContext';
import { TEN_MINUTES } from '../../../common/queries/query-stale-time';
import { ApiResponseWithResultsOffset } from '../../../common/types/api';

export interface SignerInfo {
  signing_key: string;
  weight: number;
  stacked_amount: string;
  weight_percent: number;
  stacked_amount_percent: number;
}
export function useSuspensePoxSigners(cycleId: number) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<ApiResponseWithResultsOffset<SignerInfo>>({
    queryKey: ['signers', cycleId],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v2/pox/cycles/${cycleId}/signers`).then(res =>
        res.json()
      ),
    staleTime: TEN_MINUTES,
  });
}
