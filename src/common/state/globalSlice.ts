import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@common/state/hooks';
import { DEFAULT_MAINNET_SERVER, DEFAULT_NETWORK_LIST } from '@common/constants';
import { RootState } from '@common/state/store';

interface CustomNetwork {
  label: string;
  url: string;
  networkId: number;
}

export interface State {
  activeNetworkUrl: string;
  customNetworks: { [key: string]: CustomNetwork };
}

const initialState: State = {
  activeNetworkUrl: DEFAULT_MAINNET_SERVER,
  customNetworks: {},
};

export const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setActiveNetworkUrl: (state, action: PayloadAction<string>) => {
      state.activeNetworkUrl = action.payload;
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    addCustomNetwork: (state, action: PayloadAction<CustomNetwork>) => {
      state.customNetworks[action.payload.url] = action.payload;
    },
    removeCustomNetwork: (state, action: PayloadAction<string>) => {
      delete state.customNetworks[action.payload];
      state.activeNetworkUrl = DEFAULT_MAINNET_SERVER;
    },
  },
});

export const { setActiveNetworkUrl, addCustomNetwork, removeCustomNetwork } = slice.actions;

const selectGlobal = (state: RootState) => state.global;
export const selectActiveNetworkUrl = () => useAppSelector(state => state.global.activeNetworkUrl);
export const selectNetworks = () =>
  useAppSelector(
    createSelector(selectGlobal, state => [
      ...DEFAULT_NETWORK_LIST,
      ...Object.values(state.customNetworks),
    ])
  );

export default slice.reducer;
