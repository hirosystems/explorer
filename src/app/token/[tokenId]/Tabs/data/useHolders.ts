import {
  InfiniteData,
  UseSuspenseInfiniteQueryResult,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import { useGlobalContext } from '../../../../../common/context/useGlobalContext';
import { GenericResponseType } from '../../../../../common/hooks/useInfiniteQueryResult';
import { TEN_MINUTES } from '../../../../../common/queries/query-stale-time';
import { getNextPageParam } from '../../../../../common/utils/utils';

export interface HolderInfo {
  address: string;
  balance: string;
}

export interface HolderResponseType extends GenericResponseType<HolderInfo> {
  total_supply: string;
}

const defaultOptions = {
  limit: 50,
  offset: 0,
};

const HOLDERS_QUERY_KEY = 'holders';

export function useSuspenseFtHolders(tokenId: string, options: any = defaultOptions) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  const queryString = new URLSearchParams(options).toString();

  return useSuspenseInfiniteQuery<UseSuspenseInfiniteQueryResult<InfiniteData<HolderResponseType>>>(
    {
      queryKey: [HOLDERS_QUERY_KEY, tokenId],
      queryFn: ({ pageParam }: { pageParam: number }) =>
        // TODO: Update to use blockchain lib
        //   fetch(`${activeNetworkUrl}/extended/v1/tokens/ft/${tokenId}/holders?${queryString}`).then(
        fetch(
          `https://api.dev.hiro.so/extended/v1/tokens/ft/${tokenId}::ststx/holders${
            queryString ? `?${queryString}` : ''
          }`
        ).then(res => res.json()),
      staleTime: TEN_MINUTES,
      enabled: !!tokenId,
      ...options,
    }
  );
}

export function useSuspenseStxHolders(options: any = {}) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  const queryString = new URLSearchParams(options).toString();

  return useSuspenseInfiniteQuery<UseSuspenseInfiniteQueryResult<InfiniteData<HolderResponseType>>>(
    {
      queryKey: [HOLDERS_QUERY_KEY, 'stx'],
      queryFn: ({ pageParam }: { pageParam: number }) =>
        // TODO: Update to use blockchain lib
        //   fetch(`${activeNetworkUrl}/extended/v1/tokens/ft/stx/holders/holders?${queryString}`).then(
        fetch(
          `https://api.dev.hiro.so/extended/v1/tokens/ft/stx/holders/holders${
            queryString ? `?${queryString}` : ''
          }`
        ).then(res => res.json()),
      getNextPageParam,
      initialPageParam: 0,
      staleTime: TEN_MINUTES,
      options,
    }
  );
}
