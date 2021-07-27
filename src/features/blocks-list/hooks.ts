import { useInfiniteQueryAtom, useQueryAtom } from 'jotai-query-toolkit';
import { blocksListState } from '@store/blocks';
import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { microblocksSingleState } from '@store/microblocks';

export function useMicroblock(microblockHash: string) {
  return useQueryAtom(microblocksSingleState(microblockHash));
}

export function useBlocksList(limit = DEFAULT_BLOCKS_LIST_LIMIT) {
  return useInfiniteQueryAtom(blocksListState(limit));
}
