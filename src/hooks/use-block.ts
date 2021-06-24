import { useAtomValue } from 'jotai/utils';
import { blockInView, blockInViewTransactions } from '@store/currently-in-view';

export function useBlockCurrentlyInView() {
  return useAtomValue(blockInView);
}
export function useBlockTxsCurrentlyInView() {
  return useAtomValue(blockInViewTransactions);
}
