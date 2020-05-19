import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store';

const selectUiSlice = (state: RootState) => state.ui;
const selectConfigSlice = (state: RootState) => state.ui.config;

export const selectToasts = createSelector(selectUiSlice, state => state.toasts);

export const selectEnv = createSelector(selectConfigSlice, state => state.env);

export const selectNetworks = createSelector(selectConfigSlice, state => state.network);
export const selectCurrentNetworkName = createSelector(
  selectConfigSlice,
  state => state.selectedNetwork
);

export const selectCurrentNetworkUrl = createSelector(
  [selectNetworks, selectCurrentNetworkName],
  (networks, selectedNetwork) => {
    return networks[selectedNetwork];
  }
);
