import { createSelector } from '@reduxjs/toolkit';
import { accountAdapter } from '@store/debug/reducer';
import { RootState } from '@store';
import { Account } from '@store/debug/types';

const selectors = accountAdapter.getSelectors();

const selectAccountsSlice = (state: RootState) => state.accounts;

export const selectAccount = (id: Account['principal']) =>
  createSelector(selectAccountsSlice, state => selectors.selectById(state, id));

export const selectAccountBalance = (id: Account['principal']) =>
  createSelector(selectAccountsSlice, state => selectors.selectById(state, id)?.balance);

export const selectAccountNonce = (id: Account['principal']) =>
  createSelector(selectAccountsSlice, state => selectors.selectById(state, id)?.nonce);

export const selectAccountTransactions = (id: Account['principal']) =>
  createSelector(selectAccountsSlice, state => selectors.selectById(state, id)?.transactions);

export const selectLastFetch = createSelector(selectAccountsSlice, state => state.lastFetch);
export const selectAccountLoading = createSelector(selectAccountsSlice, state => state.loading);


export const selectIdentity = createSelector(selectAccountsSlice, state => state.identity);
export const selectErrorState = createSelector(selectAccountsSlice, state => state.error);
