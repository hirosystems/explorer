'use client';

import cookie from 'cookie';
import { useSearchParams } from 'next/navigation';
import { FC, ReactNode, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { StacksApiSocketClient, StacksApiWebSocketClient, connectWebSocketClient } from '@stacks/blockchain-api-client';
import { ChainID } from '@stacks/transactions';

import { useStacksApiSocketClient } from '../../app/_components/BlockList/Sockets/use-stacks-api-socket-client';
import { buildCustomNetworkUrl, fetchCustomNetworkId } from '../components/modals/AddNetwork/utils';
import { DEFAULT_DEVNET_SERVER, IS_BROWSER } from '../constants/constants';
import {
  NetworkIdModeMap,
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeUrlMap,
} from '../constants/network';
import { Network, NetworkModes } from '../types/network';
import { removeTrailingSlash } from '../utils/utils';

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
  webSocketClient?: Promise<StacksApiWebSocketClient>;
  // stacksApiSocketClient: StacksApiSocketClient | null;
}

export const GlobalContext = createContext<GlobalContextProps>({
  cookies: '',
  apiUrls: NetworkModeUrlMap,
  btcBlockBaseUrls: NetworkModeBtcBlockBaseUrlMap,
  btcTxBaseUrls: NetworkModeBtcTxBaseUrlMap,
  btcAddressBaseUrls: NetworkModeBtcAddressBaseUrlMap,
  activeNetwork: {
    label: 'Stacks Mainnet',
    url: NetworkModeUrlMap[NetworkModes.Mainnet],
    btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
    btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
    btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
    networkId: ChainID.Mainnet,
    mode: NetworkModes.Mainnet,
  },
  activeNetworkKey: NetworkModeUrlMap[NetworkModes.Mainnet], // TODO: this is a confusing name as it's actually the url for the api based on the network...
  addCustomNetwork: () => Promise.resolve(),
  removeCustomNetwork: () => true,
  networks: {},
  webSocketClient: undefined,
  // stacksApiSocketClient: null,
});

export const AppContextProvider: FC<{
  headerCookies: string | null;
  apiUrls: Record<NetworkModes, string>;
  btcBlockBaseUrls: Record<NetworkModes, string>;
  btcTxBaseUrls: Record<NetworkModes, string>;
  btcAddressBaseUrls: Record<NetworkModes, string>;
  children: ReactNode;
}> = ({
  headerCookies,
  apiUrls,
  btcBlockBaseUrls,
  btcTxBaseUrls,
  btcAddressBaseUrls,
  children,
}) => {
  const cookies = headerCookies || (IS_BROWSER ? document?.cookie : '');
  const searchParams = useSearchParams();
  const chain = searchParams?.get('chain');
  const api = searchParams?.get('api');
  const subnet = searchParams?.get('subnet');
  const btcBlockBaseUrl = searchParams?.get('btcBlockBaseUrl');
  const btcTxBaseUrl = searchParams?.get('btcTxBaseUrl');
  const btcAddressBaseUrl = searchParams?.get('btcAddressBaseUrl');

  const queryNetworkMode = ((Array.isArray(chain) ? chain[0] : chain) ||
    NetworkModes.Mainnet) as NetworkModes;
  const queryApiUrl = removeTrailingSlash(Array.isArray(api) ? api[0] : api);
  const querySubnet = Array.isArray(subnet) ? subnet[0] : subnet;
  const queryBtcBlockBaseUrl = Array.isArray(btcBlockBaseUrl)
    ? btcBlockBaseUrl[0]
    : btcBlockBaseUrl;
  const queryBtcTxBaseUrl = Array.isArray(btcTxBaseUrl) ? btcTxBaseUrl[0] : btcTxBaseUrl;
  const queryBtcAddressBaseUrl = Array.isArray(btcAddressBaseUrl)
    ? btcAddressBaseUrl[0]
    : btcAddressBaseUrl;

  if (IS_BROWSER && (window as any)?.location?.search?.includes('err=1'))
    throw new Error('test error');
  const customNetworksCookie = JSON.parse(cookie.parse(cookies || '').customNetworks || '{}');
  const [_, setCookie] = useCookies(['customNetworks']);
  const [customNetworks, setCustomNetworks] = useState(customNetworksCookie);
  const activeNetworkKey = querySubnet || queryApiUrl || apiUrls[queryNetworkMode];

  // const {
  //   client: stacksApiSocketClient,
  //   connect: connectStacksApiSocket,
  //   disconnect: disconnectStacksApiSocket,
  // } = useStacksApiSocketClient(queryNetworkMode);
  // Connect to the stacks api socket, disconnect when the component unmounts, and reconnect if the connection is lost
  // useEffect(() => {
  //   if (!stacksApiSocketClient?.socket.connected) {
  //     connectStacksApiSocket();
  //   }
  //   return () => {
  //     disconnectStacksApiSocket();
  //   };
  // }, [stacksApiSocketClient, connectStacksApiSocket, disconnectStacksApiSocket]);

  const isUrlPassedSubnet = !!querySubnet && !customNetworks[querySubnet];
  const networks: Record<string, Network> = useMemo<Record<string, Network>>(
    () => ({
      [apiUrls[NetworkModes.Mainnet]]: {
        label: 'Stacks Mainnet',
        url: apiUrls[NetworkModes.Mainnet],
        btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
        btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
        btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
        networkId: ChainID.Mainnet,
        mode: NetworkModes.Mainnet,
      },
      [apiUrls[NetworkModes.Testnet]]: {
        label: 'Stacks Testnet',
        url: apiUrls[NetworkModes.Testnet],
        btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
        btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
        btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
        networkId: ChainID.Testnet,
        mode: NetworkModes.Testnet,
      },
      'https://api.nakamoto.testnet.hiro.so': {
        label: 'Nakamoto Testnet',
        url: 'https://api.nakamoto.testnet.hiro.so',
        btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
        btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
        btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
        networkId: ChainID.Testnet,
        mode: NetworkModes.Testnet,
        isCustomNetwork: true,
      },
      [DEFAULT_DEVNET_SERVER]: {
        label: 'Devnet',
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
        webSocketClient: activeNetworkKey
          ? connectWebSocketClient(activeNetworkKey.replace('https://', 'wss://'))
          : undefined,
        // stacksApiSocketClient,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
