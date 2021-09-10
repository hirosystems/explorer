import { useAtomValue } from 'jotai/utils';
import { stacksInfoState } from '@store/info';

export function useStacksInfo() {
  return useAtomValue(stacksInfoState);
}
