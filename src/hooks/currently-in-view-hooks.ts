import { useAtomValue } from 'jotai/utils';
import {
  accountInViewStackingStartBlockHeight,
  addressInViewState,
  blockHashInView,
  blockInViewState,
  contractInfoInViewState,
  contractInterfaceInViewState,
  contractSourceInViewState,
  currentlyInViewBlockHash,
  currentlyInViewState,
  currentlyInViewTxId,
  transactionInViewState,
  transactionTypeInViewState,
} from '@store/currently-in-view';
import { IS_DEV } from '@common/constants';
import { useAtomDevtools } from '@common/hooks/use-atom-devtools';

export function useAccountInViewStackingStartBlockHeight() {
  return useAtomValue(accountInViewStackingStartBlockHeight);
}

export const useDebugInView = () => {
  if (!IS_DEV) return;
  useAtomDevtools(transactionInViewState as any);
  useAtomDevtools(transactionTypeInViewState as any);
  useAtomDevtools(blockInViewState as any);
  useAtomDevtools(contractSourceInViewState as any);
  useAtomDevtools(contractInterfaceInViewState as any);
  useAtomDevtools(contractInfoInViewState as any);
  useAtomDevtools(addressInViewState as any);
  useAtomDevtools(currentlyInViewState as any);
  useAtomDevtools(currentlyInViewTxId as any);
  useAtomDevtools(blockHashInView as any);
  useAtomDevtools(currentlyInViewBlockHash as any);
};
