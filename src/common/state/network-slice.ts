import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_MAINNET_SERVER } from '@common/constants';
import { RootState } from '@common/state/store';
import { HYDRATE } from 'next-redux-wrapper';
import { DEFAULT_NETWORK_MAP } from '@common/constants/network';
import { Network } from '@common/types/network';

interface State {
  activeNetworkKey: string;
  networks: { [key: string]: Network };
}

const initialState: State = {
  activeNetworkKey: DEFAULT_MAINNET_SERVER,
  networks: DEFAULT_NETWORK_MAP,
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
      state.activeNetworkKey = action.payload.url;
      reloadWithNewMode(action.payload.mode);
    },
    addCustomNetwork: (state, action: PayloadAction<Network>) => {
      state.networks[action.payload.url] = action.payload;
    },
    removeCustomNetwork: (state, action: PayloadAction<Network>) => {
      delete state.networks[action.payload.url];
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.global,
      };
    },
  },
});

export const { setActiveNetwork, addCustomNetwork, removeCustomNetwork } = networkSlice.actions;

const selectGlobal = (state: RootState) => state.global;

export const selectActiveNetwork = createSelector(
  [selectGlobal],
  global => global.networks[global.activeNetworkKey]
);
export const selectNetworks = createSelector([selectGlobal], global => global.networks);
