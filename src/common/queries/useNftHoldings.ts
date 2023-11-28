import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

import { NonFungibleTokenHoldingsList } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export const useSuspenseNftHoldings = (
  address?: string,
  options: any = {}
): UseSuspenseQueryResult<NonFungibleTokenHoldingsList> => {
  const api = useApi();
  if (!address) throw new Error('Address is required');
  return useSuspenseQuery({
    queryKey: ['nftHoldings', address],
    queryFn: () =>
      api.nonFungibleTokensApi.getNftHoldings({
        principal: address,
        limit: 200,
      }),
    staleTime: ONE_MINUTE,
    ...options,
  });
};
