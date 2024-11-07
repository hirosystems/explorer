'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Provider as ReduxProvider } from 'react-redux';

import { GlobalContextProvider } from '../../common/context/GlobalContextProvider';
import { store } from '../../common/state/store';
import { NetworkModes } from '../../common/types/network';
import { removeTrailingSlash } from '../../common/utils/utils';
import { ColorModeProvider } from '../../components/ui/color-mode';
import { system } from '../../ui/theme/theme';
import { AppConfig } from './AppConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 5000,
    },
  },
});

export const Providers = ({
  children,
  addedCustomNetworksCookie,
  removedCustomNetworksCookie,
}: {
  children: ReactNode;
  addedCustomNetworksCookie: string | undefined;
  removedCustomNetworksCookie: string | undefined;
}) => {
  const searchParams = useSearchParams();
  const chain = searchParams?.get('chain');
  const api = searchParams?.get('api');
  const subnet = searchParams?.get('subnet');

  const queryNetworkMode = ((Array.isArray(chain) ? chain[0] : chain) ||
    NetworkModes.Mainnet) as NetworkModes;
  const queryApiUrl = removeTrailingSlash(Array.isArray(api) ? api[0] : api);
  const querySubnet = Array.isArray(subnet) ? subnet[0] : subnet;

  return (
    <GlobalContextProvider
      addedCustomNetworksCookie={addedCustomNetworksCookie}
      removedCustomNetworksCookie={removedCustomNetworksCookie}
    >
      <CookiesProvider>
        <ChakraProvider value={system}>
          <ColorModeProvider>
            <ReduxProvider store={store}>
              <AppConfig // TODO: rename to something else like SessionProvider
                queryNetworkMode={queryNetworkMode}
                queryApiUrl={queryApiUrl}
                querySubnet={querySubnet}
              >
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
              </AppConfig>
            </ReduxProvider>
          </ColorModeProvider>
        </ChakraProvider>
      </CookiesProvider>
    </GlobalContextProvider>
  );
};
