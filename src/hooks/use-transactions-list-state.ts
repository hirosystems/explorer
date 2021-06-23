import { useAtomValue } from 'jotai/utils';
import { mempoolTransactionsListState, transactionsListState } from '@store/transactions';

export function useTransactionsListState() {
  return useAtomValue(transactionsListState);
}

export function useMempoolTransactionsListState() {
  return useAtomValue(mempoolTransactionsListState);
}
