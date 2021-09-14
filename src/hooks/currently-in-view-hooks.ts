import { useAtomValue } from 'jotai/utils';
import {
  accountInViewBalances,
  accountInViewInfo,
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
  getAccountInViewPendingTransactionsState,
  getAccountInViewTransactionsState,
  microblockInView,
  microblockInViewBlock,
  microblockInViewTransactions,
  transactionInViewState,
  transactionTypeInViewState,
} from '@store/currently-in-view';
import { transactionSingleState, TransactionsListResponse } from '@store/transactions';
import { IS_DEV } from '@common/constants';
import { useAtomDevtools } from '@common/hooks/use-atom-devtools';
import { useInfiniteQueryAtom } from 'jotai-query-toolkit';
import { WritableAtom } from 'jotai';
import { InfiniteData } from 'react-query';
import { AtomWithInfiniteQueryAction } from 'jotai/query';
import { MempoolTransactionListResponse } from '@stacks/stacks-blockchain-api-types';

export function useTransactionInView() {
  return useAtomValue(transactionInViewState);
}

export function useTransaction(txid: string) {
  return useAtomValue(transactionSingleState(txid));
}

export function useTransactionTypeInView() {
  return useAtomValue(transactionTypeInViewState);
}

export function useBlockInView() {
  return useAtomValue(blockInViewState);
}

export function useContractSourceInView() {
  return useAtomValue(contractSourceInViewState);
}

export function useContractInterfaceInView() {
  return useAtomValue(contractInterfaceInViewState);
}

export function useContractInfoInView() {
  return useAtomValue(contractInfoInViewState);
}

export function useAccountInViewTransactions() {
  const anAtom = useAtomValue(getAccountInViewTransactionsState);
  if (!anAtom) throw Error('No account in view');
  return useInfiniteQueryAtom<InfiniteData<TransactionsListResponse> | undefined>(anAtom);
}

export function useAccountInViewPendingTransactions() {
  const anAtom = useAtomValue(getAccountInViewPendingTransactionsState);
  if (!anAtom) throw Error('No account in view');
  return useInfiniteQueryAtom<InfiniteData<MempoolTransactionListResponse> | undefined>(anAtom);
}

export function useAccountInViewInfo() {
  return useAtomValue(accountInViewInfo);
}

export function useAccountInViewBalances() {
  return useAtomValue(accountInViewBalances);
}

export function useAccountInViewStxBalance() {
  return useAtomValue(accountInViewBalances);
}

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
