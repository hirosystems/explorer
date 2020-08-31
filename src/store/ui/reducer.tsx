import { createReducer } from '@reduxjs/toolkit';
import {
  doAddToast,
  doRemoveToast,
  appTime,
  setNetworks,
  selectNetwork,
  setEnv,
} from '@store/ui/actions';
import { ToastType } from '@stacks/ui';

export type Environment = 'STAGING' | 'DEV';

export interface Network {
  MOCKNET?: string;
  TESTNET?: string;
  LOCAL?: 'http://localhost:3999';
}
export type NetworkOptions = 'MOCKNET' | 'TESTNET' | 'LOCAL';

export interface UiState {
  toasts: ToastType[] | any[];
  appTime: number;
  config: {
    network: Network;
    selectedNetwork: NetworkOptions;
    env?: Environment;
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
    env: undefined,
  },
};

export const uiReducer = createReducer(initialState, builder => {
  builder.addCase(setEnv, (state, action) => {
    state.config.env = action.payload;
  });
  builder.addCase(setNetworks, (state, action) => {
    Object.assign(state.config.network, action.payload);
  });
  builder.addCase(selectNetwork, (state, action) => {
    state.config.selectedNetwork = action.payload;
  });
  builder.addCase(doAddToast, (state, action) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.toasts.push(action.payload);
  });
  builder.addCase(doRemoveToast, (state, action) => {
    state.toasts = state.toasts.filter(({ id }: { id: string }) => id !== action.payload);
  });
  builder.addCase(appTime, state => {
    state.appTime = Math.round(new Date().getTime() / 1000);
  });
});
