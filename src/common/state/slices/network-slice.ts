import { Network, NetworkModes } from '@/common/types/network';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  buildCustomNetworkUrl,
  fetchCustomNetworkId,
} from '../../components/modals/AddNetwork/utils';
import {
  NetworkIdModeMap,
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeUrlMap,
  devnetNetwork,
  mainnetNetwork,
  testnetNetwork,
} from '../../constants/network';
import { useAppSelector } from '../../state/hooks';
import { removeTrailingSlash } from '../../utils/utils';

export interface NetworkState {
  activeNetwork: Network;
  networks: Record<string, Network>;
}

function filterNetworks(
  networks: Record<string, Network>,
  removedNetworks: Record<string, Network>
) {
  return Object.fromEntries(
    Object.entries(networks).filter(([key]) => !Object.keys(removedNetworks).includes(key))
  );
}

// Helper function to initialize the network state based on URL parameters
export const initializeNetworkState = async (
  searchParams: URLSearchParams,
  addedCustomNetworksCookie: string | undefined,
  removedCustomNetworksCookie: string | undefined
) => {
  const chain = searchParams.get('chain');
  const api = searchParams.get('api');
  const btcBlockBaseUrl = searchParams.get('btcBlockBaseUrl');
  const btcTxBaseUrl = searchParams.get('btcTxBaseUrl');
  const btcAddressBaseUrl = searchParams.get('btcAddressBaseUrl');

  // Derive network mode and URLs from params
  const networkModeFromSearchParams = (chain || NetworkModes.Mainnet) as NetworkModes;
  const apiUrlFromSearchParams = removeTrailingSlash(api || '') || null;

  // Determine active network URL
  const activeNetworkUrl = apiUrlFromSearchParams || NetworkModeUrlMap[networkModeFromSearchParams];

  const addedCustomNetworks: Record<string, Network> = JSON.parse(
    addedCustomNetworksCookie || '{}'
  );

  // This is used to keep track of default networks that have been removed. By default, default networks
  // are included in the networks list. Therefore, we need to remember that the default network has been removed
  // so that we can remove it from the networks list. If we don't allow users to remove the default networks,
  // which we should do, then we could remove this logic.
  const removedCustomNetworks: Record<string, Network> = JSON.parse(
    removedCustomNetworksCookie || '{}'
  );

  // Initialize base networks
  let networks: Record<string, Network> = filterNetworks(
    {
      [mainnetNetwork.url]: mainnetNetwork,
      [testnetNetwork.url]: testnetNetwork,
      [devnetNetwork.url]: devnetNetwork,
      ...addedCustomNetworks,
    },
    removedCustomNetworks
  );

  // Add custom API network if provided in the URL
  if (apiUrlFromSearchParams && !networks[apiUrlFromSearchParams]) {
    const networkUrl = buildCustomNetworkUrl(apiUrlFromSearchParams);
    const networkId = await fetchCustomNetworkId(networkUrl, false);
    if (networkId) {
      networks[apiUrlFromSearchParams] = {
        label: apiUrlFromSearchParams,
        url: networkUrl,
        btcBlockBaseUrl: btcBlockBaseUrl || NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
        btcTxBaseUrl: btcTxBaseUrl || NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
        btcAddressBaseUrl:
          btcAddressBaseUrl || NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
        networkId,
        mode: NetworkIdModeMap[networkId],
        isCustomNetwork: true,
        isSubnet: false,
      };
    }
  }

  return {
    networks,
    activeNetwork: networks[activeNetworkUrl] || mainnetNetwork,
  };
};

export const initialState: NetworkState = {
  activeNetwork: mainnetNetwork,
  networks: {
    [mainnetNetwork.url]: mainnetNetwork,
    [testnetNetwork.url]: testnetNetwork,
    [devnetNetwork.url]: devnetNetwork,
  },
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setActiveNetwork: (state, action: PayloadAction<Network>) => {
      state.activeNetwork = action.payload;
    },
    addNetwork: (state, action: PayloadAction<Network>) => {
      state.networks[action.payload.url] = {
        ...action.payload,
        isCustomNetwork: true,
      };
    },
    removeNetwork: (state, action: PayloadAction<string>) => {
      const { [action.payload]: _, ...remainingNetworks } = state.networks;
      state.networks = remainingNetworks;
    },
    initializeNetworks: (state, action: PayloadAction<NetworkState>) => {
      state.networks = action.payload.networks;
      state.activeNetwork = action.payload.activeNetwork;
    },
  },
});

export const { setActiveNetwork, addNetwork, removeNetwork, initializeNetworks } =
  networkSlice.actions;

// Selector hooks
export const useActiveNetwork = () => useAppSelector(state => state.network.activeNetwork);
export const useNetworks = () => useAppSelector(state => state.network.networks);

export default networkSlice.reducer;
