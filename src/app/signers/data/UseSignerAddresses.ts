// Add missing import statement
import { useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../../../common/context/useAppContext';
import { TEN_MINUTES, TWO_MINUTES } from '../../../common/queries/query-stale-time';

const SIGNER_ADDRESSES_QUERY_KEY = 'signer-addresses';

export interface SignersStackersData {
  stacker_address: string;
  stacked_amount: string;
  pox_address: string;
}

export function useGetStackersBySignerQuery() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return (cycleId: number, signerKey: string) => ({
    queryKey: [SIGNER_ADDRESSES_QUERY_KEY, cycleId, signerKey],
    queryFn: () =>
      fetch(
        `${activeNetworkUrl}/extended/v2/pox/cycles/${cycleId}/signers/${signerKey}/stackers`
      ).then(res => res.json()),
    staleTime: TWO_MINUTES,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useSuspenseSignerAddresses(cycleId: number, signerKey: string) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<any>({
    queryKey: [SIGNER_ADDRESSES_QUERY_KEY, cycleId, signerKey],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v2/pox/cycles/${cycleId}/signers/${signerKey}`).then(
        res => res.json()
      ),
    staleTime: TEN_MINUTES,
  });
}
