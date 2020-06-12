import { createSelector } from '@reduxjs/toolkit';
import { txAdapter } from '@store/transactions/reducer';
import { RootState } from '@store';
import { Transaction } from '@models/transaction.interface';
import type { SmartContractTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

const selectors = txAdapter.getSelectors();

const selectTransactionsSlice = (state: RootState) => state.transactions;

export const selectAllTransactions = createSelector(selectTransactionsSlice, state =>
  selectors.selectAll(state)
);

export const selectTransaction = (id: Transaction['tx_id']) =>
  createSelector(selectTransactionsSlice, state => selectors.selectById(state, id));

export const selectTransactionByIdOrContractName = (query: string) =>
  createSelector(selectAllTransactions, transactions => {
    if (transactions.length) {
      if (query.includes('.')) {
        // contract name most likely (hopefully)
        return (transactions as any).find(
          (transaction: Transaction) =>
            (transaction.tx_type === 'contract_call' &&
              transaction.contract_call.contract_id === query) ||
            (transaction.tx_type === 'smart_contract' &&
              transaction.smart_contract.contract_id === query)
        );
      } else {
        return (transactions as any).find(
          (transaction: Transaction) => transaction.tx_id === query
        );
      }
    }
  });

export const selectTransactionLoading = createSelector(
  selectTransactionsSlice,
  state => state.loading !== 'idle'
);
export const selectTransactionError = createSelector(selectTransactionsSlice, state => state.error);
export const selectTransactionLastTxId = createSelector(
  selectTransactionsSlice,
  state => state.lastTxId
);

export const selectOriginContractSource = (contractName: string) =>
  createSelector(selectTransactionsSlice, state => {
    const address = contractName.split('.')[0];
    const txs = Object.keys(state.entities).map(tx_id => state.entities[tx_id]);

    const contract = txs.find(
      tx => tx?.tx_type === 'smart_contract' && tx.sender_address === address
    ) as SmartContractTransaction;

    return contract.smart_contract.source_code || undefined;
  });
