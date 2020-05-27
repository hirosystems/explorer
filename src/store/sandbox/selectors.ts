import { createSelector } from '@reduxjs/toolkit';
import { sandboxAdapter } from '@store/sandbox/reducer';
import { RootState } from '@store';
import { Account } from '@store/sandbox/types';

const selectors = sandboxAdapter.getSelectors();

const selectSandboxSlice = (state: RootState) => state.sandbox;

export const selectAccount = (id: Account['principal']) =>
  createSelector(selectSandboxSlice, state => selectors.selectById(state, id));

export const selectAccountBalance = (id: Account['principal']) =>
  createSelector(selectSandboxSlice, state => selectors.selectById(state, id)?.balance);

export const selectAccountNonce = (id: Account['principal']) =>
  createSelector(selectSandboxSlice, state => selectors.selectById(state, id)?.nonce);

export const selectAccountTransactions = (id: Account['principal']) =>
  createSelector(selectSandboxSlice, state => selectors.selectById(state, id)?.transactions);

export const selectLastFetch = createSelector(selectSandboxSlice, state => state.lastFetch);
export const selectAccountLoading = createSelector(selectSandboxSlice, state => state.loading);

export const selectIdentity = createSelector(selectSandboxSlice, state => state.identity);
export const selectUserData = createSelector(selectSandboxSlice, state => state.identity);
export const selectErrorState = createSelector(selectSandboxSlice, state => state.error);
