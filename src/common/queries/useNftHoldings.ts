import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

import { NonFungibleTokenHoldingsList } from '@stacks/stacks-blockchain-api-types';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';
import { ONE_MINUTE } from './query-stale-time';

export const useSuspenseNftHoldings = (
  address?: string,
  options: any = {}
): UseSuspenseQueryResult<NonFungibleTokenHoldingsList> => {
  const apiClient = useApiClient();
  if (!address) throw new Error('Address is required');
  return useSuspenseQuery({
    queryKey: ['nftHoldings', address],
    queryFn: async () => {
      if (!address) return undefined;
      return await callApiWithErrorHandling(apiClient, '/extended/v1/tokens/nft/holdings', {
        params: { query: { principal: address, limit: 200, tx_metadata: false } },
      });
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
};
