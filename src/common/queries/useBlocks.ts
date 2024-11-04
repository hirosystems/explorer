import { useInfiniteQuery } from '@tanstack/react-query';

import { NakamotoBlock } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../context/useGlobalContext';
import { ApiResponseWithCursorPagination } from '../types/api';
import { getNextPageCursorParam, getPreviousPageCursorParam } from '../utils/api';
import { TWO_MINUTES } from './query-stale-time';

const BLOCKS_QUERY_KEY = 'blocks';

interface BlocksResponse {
  limit: number;
  offset: number;
  total: number;
  next_cursor: string | null;
  prev_cursor: string | null;
  cursor: string;
  results: NakamotoBlock[];
}

const DEFAULT_BLOCKS_LIMIT = 20;

const fetchBlocks = async (
  apiUrl: string,
  pageParam: string,
  options: any
): Promise<ApiResponseWithCursorPagination<BlocksResponse>> => {
  const limit = options.limit || DEFAULT_BLOCKS_LIMIT;
  const cursor = pageParam || undefined;
  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries({
        ...(limit ? { limit: limit.toString() } : {}),
        ...(cursor ? { cursor } : {}),
      }).filter(([_, value]) => value !== undefined)
    )
  ).toString();
  const response = await fetch(
    `${apiUrl}/extended/v2/blocks${queryString ? `?${queryString}` : ''}`
  );
  return response.json();
};

export function useBlocks(options: any = {}) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useInfiniteQuery<ApiResponseWithCursorPagination<BlocksResponse>>({
    queryKey: [BLOCKS_QUERY_KEY],
    queryFn: ({ pageParam }) => fetchBlocks(activeNetworkUrl, pageParam as string, options),
    getNextPageParam: getNextPageCursorParam,
    getPreviousPageParam: getPreviousPageCursorParam,
    initialPageParam: '',
    staleTime: TWO_MINUTES,
    refetchOnWindowFocus: false,
  });
}
