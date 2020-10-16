import React from 'react';
import {
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { fetchTxList } from '@common/api/transactions';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import useSWR from 'swr';

interface InitialData {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
}

interface UseFetchTransactionsOptions {
  initialData: InitialData;
  txLimit?: number;
  mempoolLimit?: number;
}

type UseFetchTransactionsReturn = [
  transactions?: TransactionResults,
  mempool?: MempoolTransactionListResponse
];

export const useFetchTransactions = (
  options: UseFetchTransactionsOptions
): UseFetchTransactionsReturn => {
  const { initialData, txLimit = 10, mempoolLimit = 10 } = options;

  const { apiServer } = useSelector((state: RootState) => ({
    apiServer: selectCurrentNetworkUrl(state),
  }));

  const fetcher = React.useCallback<
    (txMode: 'tx' | 'mp') => Promise<TransactionResults | MempoolTransactionListResponse>
  >(async (txMode: 'tx' | 'mp') => {
    if (txMode === 'tx') {
      return fetchTxList({
        apiServer: apiServer as string,
        limit: txLimit,
        types: ['smart_contract', 'contract_call', 'token_transfer'],
      })();
    }
    return fetchTxList({
      apiServer: apiServer as string,
      limit: mempoolLimit,
      mempool: true,
    })();
  }, []);

  const { data: _tx } = useSWR('tx', fetcher, {
    initialData: initialData.transactions,
    refreshInterval: 2000,
  });

  const { data: _mempool } = useSWR('mp', fetcher, {
    initialData: initialData.mempool,
    refreshInterval: 2000,
  });

  return [_tx as TransactionResults, _mempool as MempoolTransactionListResponse];
};
