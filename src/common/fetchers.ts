import {
  AddressBalanceResponse,
  MempoolTransaction,
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';

import { fetchFromSidecar } from '@common/api/fetch';
import { makeKey } from '@common/hooks/use-fetch-blocks';

export const fetchPendingTxs = (apiServer: string) => async ({
  query,
  type,
}: {
  query: string;
  type: 'principal' | 'tx_id';
}) => {
  const path = makeKey({
    type: 'tx',
    limit: 30,
    pending: true,
    index: 0,
    apiServer,
  });

  const res = await fetch(path);
  const mempool: MempoolTransactionListResponse = await res.json();

  if (type === 'principal') {
    const pendingTransactions =
      mempool?.results?.filter(
        (tx: MempoolTransaction) =>
          ((tx.tx_type === 'smart_contract' ||
            tx.tx_type === 'contract_call' ||
            tx.tx_type === 'token_transfer') &&
            tx.sender_address === query) ||
          (tx.tx_type === 'token_transfer' && tx.token_transfer.recipient_address === query)
      ) || [];

    return pendingTransactions;
  } else {
    return mempool?.results?.find(
      (tx: MempoolTransaction) => tx.tx_id === query
    ) as MempoolTransaction;
  }
};

export const fetchBalances = (apiServer: string) => async (
  principal: string
): Promise<AddressBalanceResponse> => {
  const path = `/address/${principal}/balances`;
  const res = await fetchFromSidecar(apiServer)(path);
  return res.json();
};

export const fetchTransactions = (apiServer: string) => async (
  principal: string
): Promise<TransactionResults> => {
  const path = `/address/${principal}/transactions?limit=50`;
  const res = await fetchFromSidecar(apiServer)(path);
  const final = await res.json();

  return final;
};

export interface AllAccountData {
  balances: AddressBalanceResponse;
  transactions: TransactionResults;
  pendingTransactions: MempoolTransaction[];
}

export const fetchAllAccountData = (apiServer: string) => async (
  principal: string
): Promise<AllAccountData> => {
  const [balances, transactions, pendingTransactions] = await Promise.all([
    fetchBalances(apiServer)(principal),
    fetchTransactions(apiServer)(principal),
    fetchPendingTxs(apiServer)({ query: principal, type: 'principal' }),
  ]);

  return {
    balances,
    transactions,
    pendingTransactions: pendingTransactions as MempoolTransaction[],
  };
};
