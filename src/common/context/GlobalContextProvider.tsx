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
import {
  NetworkIdModeMap,
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeUrlMap,
  devnetNetwork,
  mainnetNetwork,
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
  activeNetwork: Network;
  activeNetworkKey: string;
  addCustomNetwork: (network: Network) => void;
  removeCustomNetwork: (network: Network) => void;
  networks: Record<string, Network>;
  stacksApiSocketClientInfo: StacksApiSocketClientInfo | null;
  apiClient: ReturnType<typeof getApiClient>;
}

export const GlobalContext = createContext<GlobalContext>({
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
  const btcBlockBaseUrl = searchParams?.get('btcBlockBaseUrl');
  const btcTxBaseUrl = searchParams?.get('btcTxBaseUrl');
  const btcAddressBaseUrl = searchParams?.get('btcAddressBaseUrl');

  // Deriving and setting up network state
  const queryNetworkMode = ((Array.isArray(chain) ? chain[0] : chain) ||
    NetworkModes.Mainnet) as NetworkModes;
  const queryApiUrl = removeTrailingSlash(Array.isArray(api) ? api[0] : api);
  const queryBtcBlockBaseUrl = Array.isArray(btcBlockBaseUrl)
    ? btcBlockBaseUrl[0]
    : btcBlockBaseUrl;
  const queryBtcTxBaseUrl = Array.isArray(btcTxBaseUrl) ? btcTxBaseUrl[0] : btcTxBaseUrl;
  const queryBtcAddressBaseUrl = Array.isArray(btcAddressBaseUrl)
    ? btcAddressBaseUrl[0]
    : btcAddressBaseUrl;
  const activeNetworkKey = queryApiUrl || NetworkModeUrlMap[queryNetworkMode];

  const addedCustomNetworks: Record<string, Network> = JSON.parse(
    addedCustomNetworksCookie || '{}'
  );
  const removedCustomNetworks: Record<string, Network> = JSON.parse(
    removedCustomNetworksCookie || '{}'
  );
  const [_, setAddedCustomNetworksCookie] = useCookies(['addedCustomNetworks']);
  const [__, setRemovedCustomNetworksCookie] = useCookies(['removedCustomNetworks']);

  const [networks, setNetworks] = useState<Record<string, Network>>(
    filterNetworks(
      {
        [mainnetNetwork.url]: mainnetNetwork,
        [testnetNetwork.url]: testnetNetwork,
        [devnetNetwork.url]: devnetNetwork,
        ...addedCustomNetworks,
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
        activeNetworkKey, // TODO: rename this to activeNetworkUrl. activeNetwork should be used instead of activeNetworkKey as having the information in both places is redundant
        addCustomNetwork,
        removeCustomNetwork,
        networks,
        apiClient: getApiClient(activeNetworkKey),

        stacksApiSocketClientInfo: {
          client: stacksApiSocketClient,
          connect: connectStacksApiSocket,
          disconnect: disconnectStacksApiSocket,
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
