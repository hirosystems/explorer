import { useApi } from "@/common/api/useApi";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useStackingPoolMembers(
    heightOrHash: number | string,
    options: any = {}
  ): UseQueryResult<BurnBlock> {
    const api = useApi();
    return useQuery({
      queryKey: ['burn-block', heightOrHash],
      queryFn: () =>
        api.infoApi.
      staleTime: Infinity,
      ...options,
    });
  }

  interface StackingPoolMember {

  }

  const fetchStackingPoolMembers = async (
    tokenId: string,
    pageParam: number,
    options: any
  ): Promise<StackingPoolMember> => {
      limit: limit.toString(),
      offset: offset.toString(),
    }).toString();
    const response = await fetch(
      `https://api.dev.hiro.so/extended/v1/tokens/ft/${tokenId}/holders${
        queryString ? `?${queryString}` : ''
      }`
    );
    return response.json();
  };
  
  export function useSuspenseFtHolders(fullyQualifiedTokenId: string, options: any = {}) {
    //   const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  
    return useSuspenseInfiniteQuery<HolderResponseType>({
      queryKey: [HOLDERS_QUERY_KEY, fullyQualifiedTokenId],
      queryFn: ({ pageParam }: { pageParam: number }) =>
        fetchHolders(fullyQualifiedTokenId, pageParam, options),
      getNextPageParam,
      initialPageParam: 0,
      staleTime: TEN_MINUTES,
      enabled: !!fullyQualifiedTokenId,
      ...options,
    });
  }