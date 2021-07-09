import { useAtomValue } from 'jotai/utils';
import { useQueryAtom } from 'jotai-query-toolkit';
import { blocksListState } from '@store/blocks';
import { DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { microblocksSingleState } from '@store/microblocks';

export function useMicroblock(microblockHash: string) {
  return useQueryAtom(microblocksSingleState(microblockHash));
}

export function useBlocksList(limit = DEFAULT_LIST_LIMIT_SMALL) {
  return useAtomValue(blocksListState(limit));
}
