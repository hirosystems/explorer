import { createReducer, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store';
import { fetchTransactionDone } from './actions';

const txAdapter = createEntityAdapter({
  selectId: (transaction: any) => transaction.txid,
});

const initialState = txAdapter.getInitialState();

export const transactionReducer = createReducer(initialState, {
  [fetchTransactionDone.type]: (state, action) => txAdapter.addOne(state, action.payload),
});

const { selectEntities } = txAdapter.getSelectors();

const selectTransactionsSlice = (state: RootState) => state.transactions;

export const selectTransaction = createSelector(selectTransactionsSlice, selectEntities);
