import { useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useGlobalContext';

interface StxSupplyResponse {
  unlocked_percent: string;
  total_stx: string;
  total_stx_year_2050: string;
  unlocked_stx: string;
  block_height: number;
}

export const useSuspenseStxSupply = () => {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useSuspenseQuery<StxSupplyResponse>({
    queryKey: ['stx-supply'],
    queryFn: () => fetch(`${activeNetworkUrl}/extended/v1/stx_supply`).then(res => res.json()),
    staleTime: 30 * 60 * 1000,
  });
};
