import { useAtomValue } from 'jotai/utils';
import { blocksListState } from '@store/blocks';

export function useBlocksList() {
  return useAtomValue(blocksListState);
}
