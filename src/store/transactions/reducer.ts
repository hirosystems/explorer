import { createEntityAdapter, createReducer, SerializedError } from '@reduxjs/toolkit';
import { Transaction } from '@models/transaction.interface';
import { fetchTransaction, clearTransactionsError } from './actions';

export const txAdapter = createEntityAdapter({
  selectId: (transaction: Transaction) => transaction.tx_id,
});

const initialState = txAdapter.getInitialState<{
  loading: 'idle' | 'pending' | 'rejected';
  error?: SerializedError;
  lastTxId?: string;
}>({
  loading: 'idle',
  error: undefined,
  lastTxId: undefined,
});

export const transactions = createReducer(initialState, builder => {
  builder.addCase(clearTransactionsError, state => {
    if (state.loading === 'idle') {
      state.error = undefined;
    }
  });

  builder.addCase(fetchTransaction.pending, state => {
    if (state.loading === 'idle') {
      state.loading = 'pending';
      state.error = undefined;
    }
  });
  builder.addCase(fetchTransaction.fulfilled, (state, action) => {
    if (state.loading === 'pending') {
      action.payload.forEach(tx => {
        txAdapter.upsertOne(state, tx);
      });
      state.loading = 'idle';
      state.error = undefined;
      state.lastTxId = action.payload[0].tx_id;
    }
  });
  builder.addCase(fetchTransaction.rejected, (state, action) => {
    if (state.loading === 'pending') {
      state.loading = 'idle';
      state.error = action.error;
    }
  });
});
