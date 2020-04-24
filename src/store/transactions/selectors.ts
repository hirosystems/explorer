import { createSelector } from '@reduxjs/toolkit';
import { txAdapter } from '@store/transactions/reducer';
import { RootState } from '@store';
import { Transaction } from '@models/transaction.interface';
import type { SmartContractTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

const selectors = txAdapter.getSelectors();

const selectTransactionsSlice = (state: RootState) => state.transactions;

export const selectTransaction = (id: Transaction['tx_id']) =>
  createSelector(selectTransactionsSlice, state => selectors.selectById(state, id));

export const selectTransactionLoading = createSelector(
  selectTransactionsSlice,
  state => state.loading
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
