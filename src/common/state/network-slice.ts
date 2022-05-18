import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_MAINNET_SERVER } from '@common/constants';
import { RootState } from '@common/state/store';
import { HYDRATE } from 'next-redux-wrapper';
import { DEFAULT_NETWORK_MAP } from '@common/constants/network';
import { Network } from '@common/types/network';

export interface NetworkState {
  activeNetworkKey: string;
  customNetworks: Record<string, Network>;
}

const initialState: NetworkState = {
  activeNetworkKey: DEFAULT_MAINNET_SERVER,
  customNetworks: {},
};

const RELOAD_DELAY = 500;

const reloadWithNewMode = (networkMode: string) =>
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      const href = new URL(window.location.href);
      href.searchParams.set('chain', networkMode);
      window?.location?.replace(href.toString());
    }
  }, RELOAD_DELAY);

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setActiveNetwork: (state, action: PayloadAction<Network>) => {
      console.log('[debug] setActiveNetwork', action);
      state.activeNetworkKey = action.payload.url;
      reloadWithNewMode(action.payload.mode);
    },
    addCustomNetwork: (state, action: PayloadAction<Network>) => {
      state.customNetworks[action.payload.url] = action.payload;
    },
    removeCustomNetwork: (state, action: PayloadAction<Network>) => {
      delete state.customNetworks[action.payload.url];
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.network,
      };
    },
  },
});

export const { setActiveNetwork, addCustomNetwork, removeCustomNetwork } = networkSlice.actions;

export const selectNetworkSlice = (state: RootState) => state.network;

export const selectNetworks = createSelector([selectNetworkSlice], networkSlice => ({
  ...DEFAULT_NETWORK_MAP,
  ...networkSlice.customNetworks,
}));

export const selectActiveNetwork = createSelector(
  [selectNetworkSlice, selectNetworks],
  (networkSlice, networks) => networks[networkSlice.activeNetworkKey]
);
