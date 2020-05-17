import { createReducer } from '@reduxjs/toolkit';
import { doAddToast, doRemoveToast, appTime, setNetworks, selectNetwork } from '@store/ui/actions';
import { ToastType } from '@blockstack/ui';

export interface Network {
  MOCKNET?: string;
  TESTNET?: string;
  LOCAL?: 'http://localhost:3999';
}
export type NetworkOptions = 'MOCKNET' | 'TESTNET' | 'LOCAL';
export interface UiState {
  toasts: ToastType[];
  appTime: number;
  config: {
    network: Network;
    selectedNetwork: NetworkOptions;
  };
}

const initialState: UiState = {
  toasts: [],
  appTime: Math.round(new Date().getTime() / 1000),
  config: {
    network: {
      MOCKNET: undefined,
      TESTNET: undefined,
      LOCAL: 'http://localhost:3999',
    },
    selectedNetwork: 'TESTNET',
  },
};

export const uiReducer = createReducer(initialState, builder => {
  builder.addCase(setNetworks, (state, action) => {
    state.config.network = {
      ...state.config.network,
      ...action.payload,
    };
  });
  builder.addCase(selectNetwork, (state, action) => {
    state.config.selectedNetwork = action.payload;
  });
  builder.addCase(doAddToast, (state, action) => {
    // @ts-ignore
    state.toasts.push(action.payload);
  });
  builder.addCase(doRemoveToast, (state, action) => {
    // @ts-ignore
    state.toasts = state.toasts.filter(({ id }) => id !== action.payload);
  });
  builder.addCase(appTime, (state, action) => {
    // @ts-ignore
    state.appTime = Math.round(new Date().getTime() / 1000);
  });
});
