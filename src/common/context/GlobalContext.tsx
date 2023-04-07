import { DEFAULT_DEVNET_SERVER, IS_BROWSER } from '@/common/constants';
import { NetworkModeUrlMap } from '@/common/constants/network';
import { Network, NetworkModes } from '@/common/types/network';
import cookie from 'cookie';
import { FC, createContext, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { ChainID } from '@stacks/transactions';

interface GlobalContextProps {
  cookies: string;
  apiUrls: Record<NetworkModes, string>;
  activeNetwork: Network;
  activeNetworkKey: string;
  addCustomNetwork: (network: Network) => Promise<any>;
  removeCustomNetwork: (network: Network) => void;
  networks: Record<string, Network>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  cookies: '',
  apiUrls: NetworkModeUrlMap,
  activeNetwork: {
    label: 'hiro.so',
    url: NetworkModeUrlMap[NetworkModes.Mainnet],
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
  children,
}) => {
  if (IS_BROWSER && (window as any)?.location?.search?.includes('err=1'))
    throw new Error('test error');
  const customNetworksCookie = JSON.parse(cookie.parse(cookies || '').customNetworks || '{}');
  const [_, setCookie] = useCookies(['customNetworks']);
  const [customNetworks, setCustomNetworks] = useState(customNetworksCookie);
  const activeNetworkKey = queryApiUrl || apiUrls[queryNetworkMode];
  const networks: Record<string, Network> = useMemo<Record<string, Network>>(
    () => ({
      [apiUrls[NetworkModes.Mainnet]]: {
        label: 'hiro.so',
        url: apiUrls[NetworkModes.Mainnet],
        networkId: ChainID.Mainnet,
        mode: NetworkModes.Mainnet,
      },
      [apiUrls[NetworkModes.Testnet]]: {
        label: 'hiro.so',
        url: apiUrls[NetworkModes.Testnet],
        networkId: ChainID.Testnet,
        mode: NetworkModes.Testnet,
      },
      [DEFAULT_DEVNET_SERVER]: {
        label: 'devnet',
        url: DEFAULT_DEVNET_SERVER,
        networkId: ChainID.Testnet,
        mode: NetworkModes.Testnet,
        isCustomNetwork: true,
      },
      ...customNetworks,
    }),
    [apiUrls, customNetworks]
  );

  return (
    <GlobalContext.Provider
      value={{
        activeNetwork: networks[activeNetworkKey],
        activeNetworkKey,
        cookies,
        apiUrls,
        addCustomNetwork: (network: Network) => {
          return new Promise(resolve => {
            setCookie(
              'customNetworks',
              JSON.stringify({ ...customNetworks, [network.url]: network }),
              {
                path: '/',
                maxAge: 3600, // Expires after 1hr
                sameSite: true,
              }
            );
            setTimeout(() => {
              setCustomNetworks({
                ...customNetworks,
                [network.url]: { ...network, isCustomNetwork: true },
              });
              resolve(true);
            }, 100);
          });
        },
        removeCustomNetwork: (network: Network) => {
          const { [network.url]: omitted, ...remainingCustomNetworks } = customNetworks;
          console.log('remainingCustomNetworks', remainingCustomNetworks);
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
