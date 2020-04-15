import { createEntityAdapter, createReducer } from '@reduxjs/toolkit';
import { Transaction } from '@models/transaction.interface';
import { fetchTransaction } from './actions';

export const txAdapter = createEntityAdapter({
  selectId: (transaction: Transaction) => transaction.tx_id,
});

const initialState = txAdapter.getInitialState({
  loading: 'idle',
  error: null,
});

export const transactionReducer = createReducer(initialState, builder => {
  builder.addCase(fetchTransaction.pending, state => {
    if (state.loading === 'idle') {
      state.loading = 'pending';
    }
  });
  builder.addCase(fetchTransaction.fulfilled, (state, action) => {
    if (state.loading === 'pending') {
      txAdapter.addOne(state, action.payload);
      state.loading = 'idle';
      state.error = null;
    }
  });
  builder.addCase(fetchTransaction.rejected, (state, action) => {
    if (state.loading === 'pending') {
      state.loading = 'idle';
      // @ts-ignore
      state.error = action.error;
    }
  });
});
