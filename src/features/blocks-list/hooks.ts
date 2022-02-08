import { useInfiniteQueryAtom } from 'jotai-query-toolkit';
import { BlocksListResponse, blocksListState } from '@store/blocks';
import { DEFAULT_BLOCKS_LIST_LIMIT } from '@common/constants';
import { InfiniteData } from 'react-query';

export function useBlocksList(limit = DEFAULT_BLOCKS_LIST_LIMIT) {
  return useInfiniteQueryAtom<InfiniteData<BlocksListResponse> | undefined>(blocksListState(limit));
}
