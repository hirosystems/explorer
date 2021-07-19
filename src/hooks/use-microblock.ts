import { useQueryAtom } from 'jotai-query-toolkit';
import { microblocksSingleState } from '@store/microblocks';

export function useMicroblock(microblockHash: string) {
  return useQueryAtom(microblocksSingleState(microblockHash));
}
