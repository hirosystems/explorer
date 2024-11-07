'use client';

import { useSearchParams } from 'next/navigation';
import { FC, ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { getApiClient } from '../../api/getApiClient';
import {
  StacksApiSocketClientInfo,
  useStacksApiSocketClient,
} from '../../app/_components/BlockList/Sockets/use-stacks-api-socket-client';
import { buildCustomNetworkUrl, fetchCustomNetworkId } from '../components/modals/AddNetwork/utils';
import { IS_BROWSER } from '../constants/constants';
import {
  NetworkIdModeMap,
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeUrlMap,
  devnetNetwork,
  mainnetNetwork,
  oldTestnetNetwork,
  testnetNetwork,
} from '../constants/network';
import { ONE_HOUR } from '../queries/query-stale-time';
import { Network, NetworkModes } from '../types/network';
import { removeTrailingSlash } from '../utils/utils';

function filterNetworks(
  networks: Record<string, Network>,
  removedNetworks: Record<string, Network>
) {
  return Object.fromEntries(
    Object.entries(networks).filter(([key]) => !Object.keys(removedNetworks).includes(key))
  );
}

interface GlobalContext {
  apiUrls: Record<NetworkModes, string>;
  btcBlockBaseUrls: Record<NetworkModes, string>;
  btcTxBaseUrls: Record<NetworkModes, string>;
  btcAddressBaseUrls: Record<NetworkModes, string>;
  activeNetwork: Network;
  activeNetworkKey: string;
  addCustomNetwork: (network: Network) => void;
  removeCustomNetwork: (network: Network) => void;
  networks: Record<string, Network>;
  stacksApiSocketClientInfo: StacksApiSocketClientInfo | null;
  apiClient: ReturnType<typeof getApiClient>;
}

export const GlobalContext = createContext<GlobalContext>({
  apiUrls: NetworkModeUrlMap,
  btcBlockBaseUrls: NetworkModeBtcBlockBaseUrlMap,
  btcTxBaseUrls: NetworkModeBtcTxBaseUrlMap,
  btcAddressBaseUrls: NetworkModeBtcAddressBaseUrlMap,
  activeNetwork: mainnetNetwork,
  activeNetworkKey: NetworkModeUrlMap[NetworkModes.Mainnet],
  addCustomNetwork: (network: Network) => {},
  removeCustomNetwork: (network: Network) => {},
  networks: {},
  stacksApiSocketClientInfo: null,
  apiClient: getApiClient(NetworkModeUrlMap[NetworkModes.Mainnet]),
});

export const GlobalContextProvider: FC<{
  addedCustomNetworksCookie: string | undefined;
  removedCustomNetworksCookie: string | undefined;
  children: ReactNode;
}> = ({ addedCustomNetworksCookie, removedCustomNetworksCookie, children }) => {
  // Parsing search params
  const searchParams = useSearchParams();
  const chain = searchParams?.get('chain');
  const api = searchParams?.get('api');
  const subnet = searchParams?.get('subnet');
  const btcBlockBaseUrl = searchParams?.get('btcBlockBaseUrl');
  const btcTxBaseUrl = searchParams?.get('btcTxBaseUrl');
  const btcAddressBaseUrl = searchParams?.get('btcAddressBaseUrl');

  // Deriving and setting up network state
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
  const activeNetworkKey = querySubnet || queryApiUrl || NetworkModeUrlMap[queryNetworkMode];

  // TODO: is this needed anymore?
  if (IS_BROWSER && (window as any)?.location?.search?.includes('err=1'))
    throw new Error('test error');

  const addedCustomNetworks: Record<string, Network> = JSON.parse(
    addedCustomNetworksCookie || '{}'
  );
  const removedCustomNetworks: Record<string, Network> = JSON.parse(
    removedCustomNetworksCookie || '{}'
  );
  const [_, setAddedCustomNetworksCookie] = useCookies(['addedCustomNetworks']);
  const [__, setRemovedCustomNetworksCookie] = useCookies(['removedCustomNetworks']);

  const isUrlPassedSubnet = !!querySubnet;

  const [networks, setNetworks] = useState<Record<string, Network>>(
    filterNetworks(
      {
        [mainnetNetwork.url]: mainnetNetwork,
        [testnetNetwork.url]: testnetNetwork,
        [oldTestnetNetwork.url]: oldTestnetNetwork,
        [devnetNetwork.url]: devnetNetwork,
        ...addedCustomNetworks,
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
                networkId: 1,
                mode: NetworkModes.Mainnet,
              } as Network,
            }
          : {}),
      },
      removedCustomNetworks
    )
  );

  const addCustomNetwork = useCallback(
    (network: Network) => {
      if (network.url in addedCustomNetworks) return;

      if (network.url in removedCustomNetworks) {
        const scrubbedRemovedCustomNetworks = { ...removedCustomNetworks };
        delete scrubbedRemovedCustomNetworks[network.url];
        setRemovedCustomNetworksCookie(
          'removedCustomNetworks',
          JSON.stringify(scrubbedRemovedCustomNetworks),
          {
            path: '/',
            maxAge: ONE_HOUR,
            sameSite: true,
          }
        );
      }

      setAddedCustomNetworksCookie(
        'addedCustomNetworks',
        JSON.stringify({ ...addedCustomNetworks, [network.url]: network }),
        {
          path: '/',
          maxAge: ONE_HOUR,
          sameSite: true,
        }
      );

      setNetworks({
        ...networks,
        [network.url]: { ...network, isCustomNetwork: true },
      });
    },
    [
      addedCustomNetworks,
      setAddedCustomNetworksCookie,
      networks,
      setNetworks,
      removedCustomNetworks,
      setRemovedCustomNetworksCookie,
    ]
  );

  const removeCustomNetwork = useCallback(
    (network: Network) => {
      if (!(network.url in networks)) return;

      if (network.url in addedCustomNetworks) {
        const scrubbedAddedCustomNetworks = { ...addedCustomNetworks };
        delete scrubbedAddedCustomNetworks[network.url];
        setAddedCustomNetworksCookie(
          'addedCustomNetworks',
          JSON.stringify(scrubbedAddedCustomNetworks),
          {
            path: '/',
            maxAge: ONE_HOUR,
            sameSite: true,
          }
        );
      }

      const { [network.url]: omitted, ...remainingNetworks } = networks;
      setRemovedCustomNetworksCookie(
        'removedCustomNetworks',
        JSON.stringify({ ...removedCustomNetworks, [network.url]: omitted }),
        {
          path: '/',
          maxAge: ONE_HOUR,
          sameSite: true,
        }
      );
      setNetworks(remainingNetworks);
    },
    [
      networks,
      setNetworks,
      setRemovedCustomNetworksCookie,
      removedCustomNetworks,
      addedCustomNetworks,
      setAddedCustomNetworksCookie,
    ]
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
        addCustomNetwork(network);
      }
    };

    if (queryApiUrl && !networks[queryApiUrl]) {
      void addCustomNetworkFromQuery();
    }
  }, [
    queryApiUrl,
    networks,
    queryBtcBlockBaseUrl,
    queryBtcTxBaseUrl,
    queryBtcAddressBaseUrl,
    addCustomNetwork,
  ]);

  const {
    client: stacksApiSocketClient,
    connect: connectStacksApiSocket,
    disconnect: disconnectStacksApiSocket,
  } = useStacksApiSocketClient(activeNetworkKey);

  return (
    <GlobalContext.Provider
      value={{
        activeNetwork: networks[activeNetworkKey] || {},
        activeNetworkKey,
        apiUrls: NetworkModeUrlMap, // TODO: If this is a constant, why is it in context?
        btcBlockBaseUrls: NetworkModeBtcBlockBaseUrlMap, // TODO: If this is a constant, why is it in context?
        btcTxBaseUrls: NetworkModeBtcTxBaseUrlMap, // TODO: If this is a constant, why is it in context?
        btcAddressBaseUrls: NetworkModeBtcAddressBaseUrlMap, // TODO: If this is a constant, why is it in context?
        addCustomNetwork,
        removeCustomNetwork,
        networks,
        stacksApiSocketClientInfo: {
          client: stacksApiSocketClient,
          connect: connectStacksApiSocket,
          disconnect: disconnectStacksApiSocket,
        },
        apiClient: getApiClient(activeNetworkKey),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
