import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { ChainID } from '@stacks/transactions';

import { DEFAULT_DEVNET_SERVER, IS_BROWSER } from '@common/constants';
import { CustomNetworksLSKey } from '@common/constants/network';
import { RootState } from '@common/state/store';
import { Network, NetworkModes } from '@common/types/network';
import { getCustomNetworksFromLS } from '@common/utils';

export interface ApiUrls {
  [NetworkModes.Mainnet]: string;
  [NetworkModes.Testnet]: string;
  [NetworkModes.Devnet]: string;
}

export interface NetworkState {
  isInitialized: boolean;
  apiUrls: ApiUrls;
  activeNetworkKey: string;
  customNetworks: Record<string, Network>;
}

const initialState: NetworkState = {
  isInitialized: false,
  apiUrls: {
    [NetworkModes.Mainnet]: '',
    [NetworkModes.Testnet]: '',
    [NetworkModes.Devnet]: '',
  },
  activeNetworkKey: '',
  customNetworks: getCustomNetworksFromLS(),
};

const RELOAD_DELAY = 500;

const reloadWithNewNetwork = (
  network: Network // TODO: probably the issue
) =>
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      const href = new URL(window.location.href);
      href.searchParams.set('chain', network.mode); // TODO: this is my fix for url
      if (network.isCustomNetwork) {
        href.searchParams.set('api', network.url);
      } else {
        href.searchParams.delete('api');
      }
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
      reloadWithNewNetwork(action.payload);
    },
    addCustomNetwork: (state, action: PayloadAction<Network>) => {
      state.customNetworks[action.payload.url] = { ...action.payload, isCustomNetwork: true };
      localStorage.setItem(
        CustomNetworksLSKey,
        JSON.stringify({
          ...getCustomNetworksFromLS(),
          [action.payload.url]: state.customNetworks[action.payload.url],
        })
      );
    },
    removeCustomNetwork: (state, action: PayloadAction<Network>) => {
      delete state.customNetworks[action.payload.url];
      const { [action.payload.url]: omitted, ...remainingCustomNetworks } =
        getCustomNetworksFromLS();
      localStorage.setItem(CustomNetworksLSKey, JSON.stringify(remainingCustomNetworks));
    },
    initialize: (
      state,
      action: PayloadAction<{
        apiUrls: ApiUrls;
        queryNetworkMode: NetworkModes;
        queryApiUrl?: string;
      }>
    ) => {
      state.apiUrls = action.payload.apiUrls;
      if (action.payload.queryApiUrl) {
        state.activeNetworkKey = action.payload.queryApiUrl;
      } else {
        state.activeNetworkKey = action.payload.apiUrls[action.payload.queryNetworkMode];
      }
      state.isInitialized = true;
    },
  },
});

export const { setActiveNetwork, addCustomNetwork, removeCustomNetwork, initialize } =
  networkSlice.actions;

export const selectNetworkSlice = (state: RootState) => state.network;

export const selectNetworks = createSelector([selectNetworkSlice], networkSlice => ({
  [networkSlice.apiUrls[NetworkModes.Mainnet]]: {
    label: 'stacks.co',
    url: networkSlice.apiUrls[NetworkModes.Mainnet],
    networkId: ChainID.Mainnet,
    mode: NetworkModes.Mainnet,
  },
  [networkSlice.apiUrls[NetworkModes.Testnet]]: {
    label: 'stacks.co',
    url: networkSlice.apiUrls[NetworkModes.Testnet],
    networkId: ChainID.Testnet,
    mode: NetworkModes.Testnet,
  },
  [DEFAULT_DEVNET_SERVER]: {
    label: 'devnet',
    url: DEFAULT_DEVNET_SERVER,
    networkId: ChainID.Devnet,
    mode: NetworkModes.Devnet,
  },
  ...networkSlice.customNetworks,
}));

export const selectActiveNetwork = createSelector(
  [selectNetworkSlice, selectNetworks],
  (networkSlice, networks) => networks[networkSlice.activeNetworkKey]
);

export const selectActiveNetworkUrl = createSelector([selectActiveNetwork], activeNetwork => {
  if (
    activeNetwork &&
    !IS_BROWSER &&
    ['localhost', '127.0.0.1'].includes(new URL(activeNetwork.url).hostname)
  ) {
    return undefined;
  }
  return activeNetwork?.url;
});

export const selectIsInitialized = createSelector(
  [selectNetworkSlice],
  networkSlice => networkSlice.isInitialized
);

export const selectApiUrls = createSelector(
  [selectNetworkSlice, selectNetworks],
  networkSlice => networkSlice.apiUrls
);
