import { createEntityAdapter, createReducer } from '@reduxjs/toolkit';
import { Account, IdentityPayload } from '@store/sandbox/types';
import {
  fetchAccount,
  requestFaucetFunds,
  setIdentity,
  generateIdentity,
  broadcastTransaction,
  clearAccountError,
} from './actions';
import { RootState } from '@store';
import { dedupe } from '@common/utils';

export const accountAdapter = createEntityAdapter<Account>({
  selectId: (account: Account) => account.principal,
});

const initialState = accountAdapter.getInitialState<{
  loading: 'idle' | 'pending' | 'rejected';
  error?: any;
  lastFetch?: number;
  identity?: IdentityPayload;
}>({
  loading: 'idle',
  error: undefined,
  lastFetch: undefined,
});

const addAccountToState = (state: RootState['accounts'], action: any) => {
  if (state.loading === 'pending') {
    const txs = state.entities[action.payload.principal]?.transactions;
    accountAdapter.upsertOne(state, {
      ...action.payload,
      transactions: dedupe([...txs, ...action.payload.transactions], 'txId'),
    });
    state.loading = 'idle';
    state.error = undefined;
  }
};
const setError = (state: RootState['accounts'], action: any) => {
  state.loading = 'idle';
  state.error = action.payload || action.error;
};

const setLoading = (state: RootState['accounts']) => {
  if (state.loading === 'idle') {
    state.loading = 'pending';
    state.error = undefined;
  }
};
export const accounts = createReducer(initialState, builder => {
  builder.addCase(clearAccountError, state => {
    if (state.loading === 'idle') {
      state.error = undefined;
    }
  });
  /**
   * Set Identity
   */
  builder.addCase(setIdentity, (state, action) => {
    state.identity = action.payload;
  });

  /**
   * Generate Identity
   */
  builder.addCase(generateIdentity.pending, setLoading);

  builder.addCase(generateIdentity.fulfilled, (state, action) => {
    if (state.loading === 'pending') {
      state.identity = action.payload;
      state.loading = 'idle';
      state.error = undefined;
    }
  });

  builder.addCase(generateIdentity.rejected, setError);

  /**
   * Fetch Account
   */
  builder.addCase(fetchAccount.pending, setLoading);
  builder.addCase(fetchAccount.fulfilled, (state, action) => {
    if (state.loading === 'pending') {
      accountAdapter.upsertOne(state, {
        ...action.payload,
        transactions: state.entities[action.payload.principal]?.transactions || [],
      });
      state.loading = 'idle';
      state.lastFetch = new Date().valueOf();
      state.error = undefined;
    }
  });
  builder.addCase(fetchAccount.rejected, setError);
  /**
   * Request Faucet Funds
   */
  builder.addCase(requestFaucetFunds.pending, setLoading);
  builder.addCase(requestFaucetFunds.fulfilled, addAccountToState);
  builder.addCase(requestFaucetFunds.rejected, setError);

  /**
   * Broadcast Transaction
   */
  builder.addCase(broadcastTransaction.pending, setLoading);
  builder.addCase(broadcastTransaction.fulfilled, addAccountToState);
  builder.addCase(broadcastTransaction.rejected, setError);
});
