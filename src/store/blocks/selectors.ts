import { createSelector } from '@reduxjs/toolkit';
import { blockEntityAdapter } from '@store/blocks/reducer';
import { RootState } from '@store';
import type { Block } from '@blockstack/stacks-blockchain-api-types';

const selectors = blockEntityAdapter.getSelectors();

const selectBlocksSlice = (state: RootState) => state.blocks;

export const selectBlocks = createSelector(selectBlocksSlice, state => selectors.selectAll(state));

export const selectBlock = (hash: Block['hash']) =>
  createSelector(selectBlocksSlice, state => selectors.selectById(state, hash));

export const selectBlocksLoading = createSelector(
  selectBlocksSlice,
  state => state.loading !== 'idle'
);

export const selectBlocksError = createSelector(selectBlocksSlice, state => state.error);
