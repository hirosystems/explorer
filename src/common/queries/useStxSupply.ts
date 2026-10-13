import { useSuspenseQuery } from '@tanstack/react-query';

import { OperationResponse } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../context/useGlobalContext';

type StxSupplyResponse = OperationResponse['/extended/v3/tokens/stx/supply'];

export const useSuspenseStxSupply = () => {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useSuspenseQuery<StxSupplyResponse>({
    queryKey: ['stx-supply'],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v3/tokens/stx/supply`).then(res => res.json()),
    staleTime: 30 * 60 * 1000,
  });
};
