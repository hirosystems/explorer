import { createSelector } from '@reduxjs/toolkit';
import { txAdapter } from '@store/transactions/reducer';
import { RootState } from '@store';
import { Transaction } from '@models/transaction.interface';

const selectors = txAdapter.getSelectors();

const selectTransactionsSlice = (state: RootState) => state.transactions;

export const selectTransaction = (id: Transaction['tx_id']) =>
  createSelector(selectTransactionsSlice, state => selectors.selectById(state, id));

export const selectTransactionLoading = createSelector(selectTransactionsSlice, state => state.loading);
export const selectTransactionError = createSelector(selectTransactionsSlice, state => state.error);
