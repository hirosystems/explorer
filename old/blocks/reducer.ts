import { createEntityAdapter, createReducer, SerializedError } from '@reduxjs/toolkit';
import { doFetchBlocks, doFetchBlock, clearBlocksError } from '@store/blocks/actions';
import { Block } from '@blockstack/stacks-blockchain-api-types';

export const blockEntityAdapter = createEntityAdapter({
  selectId: (block: Block) => block.hash,
});

const initialState = blockEntityAdapter.getInitialState<{
  loading: 'idle' | 'pending' | 'rejected';
  error?: SerializedError;
  lastTxId?: string;
}>({
  loading: 'idle',
  error: undefined,
  lastTxId: undefined,
});

export const blocks = createReducer(initialState, builder => {
  builder.addCase(clearBlocksError, state => {
    if (state.loading === 'idle') {
      state.error = undefined;
    }
  });

  builder.addCase(doFetchBlocks.pending, state => {
    if (state.loading === 'idle') {
      state.loading = 'pending';
      state.error = undefined;
    }
  });
  builder.addCase(doFetchBlocks.fulfilled, (state, action) => {
    if (state.loading === 'pending') {
      action.payload.forEach(block => {
        blockEntityAdapter.upsertOne(state, block);
      });
      state.loading = 'idle';
      state.error = undefined;
    }
  });
  builder.addCase(doFetchBlocks.rejected, (state, action) => {
    if (state.loading === 'pending') {
      state.loading = 'idle';
      state.error = action.error;
    }
  });

  builder.addCase(doFetchBlock.pending, state => {
    if (state.loading === 'idle') {
      state.loading = 'pending';
      state.error = undefined;
    }
  });
  builder.addCase(doFetchBlock.fulfilled, (state, action) => {
    if (state.loading === 'pending') {
      blockEntityAdapter.upsertOne(state, action.payload);
      state.loading = 'idle';
      state.error = undefined;
    }
  });
  builder.addCase(doFetchBlock.rejected, (state, action) => {
    if (state.loading === 'pending') {
      state.loading = 'idle';
      state.error = action.error;
    }
  });
});
