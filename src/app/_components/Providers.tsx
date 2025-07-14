'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Provider as ReduxProvider } from 'react-redux';

import { GlobalContextProvider } from '../../common/context/GlobalContextProvider';
import { store } from '../../common/state/store';
import { TokenPrice } from '../../common/types/tokenPrice';
import { ColorModeProvider } from '../../components/ui/color-mode';
import { system } from '../../ui/theme/theme';
import { StacksAuthProvider } from './AppConfig';

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
  tokenPrice,
}: {
  children: ReactNode;
  addedCustomNetworksCookie: string | undefined;
  removedCustomNetworksCookie: string | undefined;
  tokenPrice: TokenPrice;
}) => {
  return (
    <ChakraProvider value={system}>
      <CookiesProvider>
        <GlobalContextProvider
          addedCustomNetworksCookie={addedCustomNetworksCookie}
          removedCustomNetworksCookie={removedCustomNetworksCookie}
          tokenPrice={tokenPrice}
        >
          <ColorModeProvider>
            <ReduxProvider store={store}>
              <StacksAuthProvider>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
              </StacksAuthProvider>
            </ReduxProvider>
          </ColorModeProvider>
        </GlobalContextProvider>
      </CookiesProvider>
    </ChakraProvider>
  );
};
