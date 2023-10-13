import { DEFAULT_DEVNET_SERVER, IS_BROWSER } from '@/common/constants';
import {
  NetworkIdModeMap,
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeUrlMap,
} from '@/common/constants/network';
import { Network, NetworkModes } from '@/common/types/network';
import cookie from 'cookie';
import { FC, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { ChainID } from '@stacks/transactions';
import {
  buildCustomNetworkUrl,
  fetchCustomNetworkId,
} from '@/components/modals/AddNetwork/AddNetworkForm';

interface GlobalContextProps {
  cookies: string;
  apiUrls: Record<NetworkModes, string>;
  btcBlockBaseUrls: Record<NetworkModes, string>;
  btcTxBaseUrls: Record<NetworkModes, string>;
  btcAddressBaseUrls: Record<NetworkModes, string>;
  activeNetwork: Network;
  activeNetworkKey: string;
  addCustomNetwork: (network: Network) => Promise<any>;
  removeCustomNetwork: (network: Network) => void;
  networks: Record<string, Network>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  cookies: '',
  apiUrls: NetworkModeUrlMap,
  btcBlockBaseUrls: NetworkModeBtcBlockBaseUrlMap,
  btcTxBaseUrls: NetworkModeBtcTxBaseUrlMap,
  btcAddressBaseUrls: NetworkModeBtcAddressBaseUrlMap,
  activeNetwork: {
    label: 'hiro.so',
    url: NetworkModeUrlMap[NetworkModes.Mainnet],
    btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
    btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
    btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
    networkId: ChainID.Mainnet,
    mode: NetworkModes.Mainnet,
  },
  activeNetworkKey: NetworkModeUrlMap[NetworkModes.Mainnet],
  addCustomNetwork: () => Promise.resolve(),
  removeCustomNetwork: () => true,
  networks: {},
});

export const AppContextProvider: FC<any> = ({
  cookies,
  queryNetworkMode,
  queryApiUrl,
  apiUrls,
  btcBlockBaseUrls,
  btcTxBaseUrls,
  btcAddressBaseUrls,
  querySubnet,
  queryBtcBlockBaseUrl,
  queryBtcTxBaseUrl,
  queryBtcAddressBaseUrl,
  children,
}) => {
  if (IS_BROWSER && (window as any)?.location?.search?.includes('err=1'))
    throw new Error('test error');
  const customNetworksCookie = JSON.parse(cookie.parse(cookies || '').customNetworks || '{}');
  const [_, setCookie] = useCookies(['customNetworks']);
  const [customNetworks, setCustomNetworks] = useState(customNetworksCookie);
  const activeNetworkKey = querySubnet || queryApiUrl || apiUrls[queryNetworkMode];
  const isUrlPassedSubnet = !!querySubnet && !customNetworks[querySubnet];
  const networks: Record<string, Network> = useMemo<Record<string, Network>>(
    () => ({
      [apiUrls[NetworkModes.Mainnet]]: {
        label: 'hiro.so',
        url: apiUrls[NetworkModes.Mainnet],
        btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
        btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
        btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
        networkId: ChainID.Mainnet,
        mode: NetworkModes.Mainnet,
      },
      [apiUrls[NetworkModes.Testnet]]: {
        label: 'hiro.so',
        url: apiUrls[NetworkModes.Testnet],
        btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
        btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
        btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
        networkId: ChainID.Testnet,
        mode: NetworkModes.Testnet,
      },
      [DEFAULT_DEVNET_SERVER]: {
        label: 'devnet',
        url: DEFAULT_DEVNET_SERVER,
        btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
        btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
        btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
        networkId: ChainID.Testnet,
        mode: NetworkModes.Testnet,
        isCustomNetwork: true,
      },
      ...customNetworks,
      ...(isUrlPassedSubnet
        ? {
            [querySubnet]: {
              isSubnet: true,
              url: querySubnet,
              btcBlockBaseUrl:
                queryBtcBlockBaseUrl || NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
              btcTxBaseUrl: queryBtcTxBaseUrl || NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
              btcAddressBaseUrl:
                queryBtcAddressBaseUrl || NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
              label: 'subnet',
              networkId: 0,
              mode: NetworkModes.Mainnet,
            },
          }
        : {}),
    }),
    [
      apiUrls,
      customNetworks,
      isUrlPassedSubnet,
      queryBtcBlockBaseUrl,
      queryBtcTxBaseUrl,
      queryBtcAddressBaseUrl,
      querySubnet,
    ]
  );

  const addCustomNetwork = useCallback(
    (network: Network) => {
      return new Promise(resolve => {
        setCookie('customNetworks', JSON.stringify({ ...customNetworks, [network.url]: network }), {
          path: '/',
          maxAge: 3600, // Expires after 1hr
          sameSite: true,
        });
        setTimeout(() => {
          setCustomNetworks({
            ...customNetworks,
            [network.url]: { ...network, isCustomNetwork: true },
          });
          resolve(true);
        }, 100);
      });
    },
    [customNetworks, setCookie]
  );

  // If the API URL from the query is not available, add it to custom networks
  useEffect(() => {
    const addCustomNetworkFromQuery = async () => {
      const networkUrl = buildCustomNetworkUrl(queryApiUrl);
      const networkId = await fetchCustomNetworkId(networkUrl, false);
      if (networkId) {
        const network: Network = {
          label: queryApiUrl,
          url: networkUrl,
          btcBlockBaseUrl:
            queryBtcBlockBaseUrl || NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
          btcTxBaseUrl: queryBtcTxBaseUrl || NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
          btcAddressBaseUrl:
            queryBtcAddressBaseUrl || NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
          networkId,
          mode: NetworkIdModeMap[networkId],
          isCustomNetwork: true,
          isSubnet: false,
        };
        void addCustomNetwork(network);
      }
    };

    if (queryApiUrl && !networks[queryApiUrl]) {
      void addCustomNetworkFromQuery();
    }
  }, [
    queryApiUrl,
    networks,
    addCustomNetwork,
    queryBtcBlockBaseUrl,
    queryBtcTxBaseUrl,
    queryBtcAddressBaseUrl,
  ]);

  return (
    <GlobalContext.Provider
      value={{
        activeNetwork: networks[activeNetworkKey] || {},
        activeNetworkKey,
        cookies,
        apiUrls,
        btcBlockBaseUrls,
        btcTxBaseUrls,
        btcAddressBaseUrls,
        addCustomNetwork,
        removeCustomNetwork: (network: Network) => {
          const { [network.url]: omitted, ...remainingCustomNetworks } = customNetworks;
          setCookie('customNetworks', JSON.stringify(remainingCustomNetworks), {
            path: '/',
            maxAge: 3600, // Expires after 1hr
            sameSite: true,
          });
          setCustomNetworks(remainingCustomNetworks);
        },
        networks,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
