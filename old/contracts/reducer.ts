import { createEntityAdapter, createReducer, SerializedError } from '@reduxjs/toolkit';
import { Contract } from '@models/contract.interface';
import { fetchContract, clearContractsError } from './actions';

export const contractsAdapter = createEntityAdapter({
  selectId: ({ contract_id }: Contract) => contract_id,
});

const initialState = contractsAdapter.getInitialState<{
  loading: 'idle' | 'pending' | 'rejected';
  error?: SerializedError;
}>({
  loading: 'idle',
  error: undefined,
});

export const contracts = createReducer(initialState, builder => {
  builder.addCase(clearContractsError, state => {
    if (state.loading === 'idle') {
      state.error = undefined;
    }
  });

  builder.addCase(fetchContract.pending, state => {
    if (state.loading === 'idle') {
      state.loading = 'pending';
    }
  });
  builder.addCase(fetchContract.fulfilled, (state, action) => {
    if (state.loading === 'pending') {
      contractsAdapter.upsertOne(state, action.payload);
      state.loading = 'idle';
      state.error = undefined;
    }
  });
  builder.addCase(fetchContract.rejected, (state, action) => {
    if (state.loading === 'pending') {
      state.loading = 'idle';
      state.error = action.error;
    }
  });
});
