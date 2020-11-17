import { createSelector } from '@reduxjs/toolkit';
import { contractsAdapter } from '@store/contracts/reducer';
import { RootState } from '@store';
import { Contract } from '@models/contract.interface';

const selectors = contractsAdapter.getSelectors();

const selectContractsSlice = (state: RootState) => state.contracts;

export const selectContract = (id: Contract['contract_id']) =>
  createSelector(selectContractsSlice, state => selectors.selectById(state, id));

export const selectContractsLoading = createSelector(selectContractsSlice, state => state.loading);
export const selectContractsError = createSelector(selectContractsSlice, state => state.error);
export const selectContractAbi = (id: Contract['contract_id']) =>
  createSelector(selectContractsSlice, state => selectors.selectById(state, id)?.abi);

export const selectContractSource = (id: Contract['contract_id']) =>
  createSelector(selectContractsSlice, state => selectors.selectById(state, id)?.source_code);
