import { UseQueryResult, useQuery } from '@tanstack/react-query';

import {
  NonFungibleTokenHistoryEventList,
  NonFungibleTokenHistoryEventWithTxMetadata,
} from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';

interface NonFungibleTokenHistoryEventListExtended extends NonFungibleTokenHistoryEventList {
  results: Array<NonFungibleTokenHistoryEventWithTxMetadata>;
}

export function useNftHistory(
  assetIdentifier: string,
  value: string,
  options: any = {}
): UseQueryResult<NonFungibleTokenHistoryEventListExtended> {
  const api = useApi();
  return useQuery({
    queryKey: ['nft-history', assetIdentifier, value],
    queryFn: () =>
      api.nonFungibleTokensApi.getNftHistory({
        assetIdentifier,
        value,
      }),
    ...options,
  });
}
