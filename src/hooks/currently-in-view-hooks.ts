import { useAtomValue } from 'jotai/utils';
import {
  accountInViewBalances,
  accountInViewStackingStartBlockHeight,
  addressInViewState,
  blockHashInView,
  blockInView,
  blockInViewState,
  blockInViewTransactions,
  contractInfoInViewState,
  contractInterfaceInViewState,
  contractSourceInViewState,
  currentlyInViewBlockHash,
  currentlyInViewState,
  currentlyInViewTxId,
  microblockInView,
  microblockInViewBlock,
  microblockInViewTransactions,
  transactionInViewState,
  transactionTypeInViewState,
} from '@store/currently-in-view';
import { IS_DEV } from '@common/constants';
import { useAtomDevtools } from '@common/hooks/use-atom-devtools';

export function useAccountInViewStackingStartBlockHeight() {
  return useAtomValue(accountInViewStackingStartBlockHeight);
}

export function useMicroblockCurrentlyInView() {
  return useAtomValue(microblockInView);
}

export function useMicroblockBlockCurrentlyInView() {
  return useAtomValue(microblockInViewBlock);
}

export function useMicroblockTxsCurrentlyInView() {
  return useAtomValue(microblockInViewTransactions);
}

export function useBlockCurrentlyInView() {
  return useAtomValue(blockInView);
}

export function useBlockTxsCurrentlyInView() {
  return useAtomValue(blockInViewTransactions);
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
  useAtomDevtools(blockInViewTransactions as any);
  useAtomDevtools(blockInView as any);
  useAtomDevtools(currentlyInViewTxId as any);
  useAtomDevtools(blockHashInView as any);
  useAtomDevtools(currentlyInViewBlockHash as any);
};
