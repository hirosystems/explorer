import { useApi } from '@/common/api/client';
import { getNextPageParam } from '@/common/utils';
import { UseQueryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { NonFungibleTokenHoldingsList } from '@stacks/stacks-blockchain-api-types';

import { ONE_MINUTE } from './query-stale-time';

export const useNftHoldings = (
  api: ReturnType<typeof useApi>,
  { address = '' }: { address?: string },
  options: UseQueryOptions<any, any, NonFungibleTokenHoldingsList, any> = {}
) => {
  return useQuery(
    ['nftHoldings', address],
    () =>
      api.nonFungibleTokensApi.getNftHoldings({
        principal: address,
        limit: 200,
      }),
    {
      getNextPageParam,
      staleTime: ONE_MINUTE,
      enabled: !!address,
      ...options,
    }
  );
};
