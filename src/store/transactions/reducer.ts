import { createReducer, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import { Transaction } from '@models/transaction.interface';
import { RootState } from '@store';
import { fetchTransactionDone } from './actions';

const txAdapter = createEntityAdapter({
  selectId: (transaction: Transaction) => transaction.tx_id,
});

const initialState = txAdapter.getInitialState();

export const transactionReducer = createReducer(initialState, {
  [fetchTransactionDone.type]: (state, action) => txAdapter.addOne(state, action.payload),
});

const selectors = txAdapter.getSelectors();

const selectTransactionsSlice = (state: RootState) => state.transactions;

export const selectTransaction = (id: string) =>
  createSelector(selectTransactionsSlice, state => selectors.selectById(state, id));
