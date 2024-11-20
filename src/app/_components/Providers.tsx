'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { FC, ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Provider as ReduxProvider } from 'react-redux';

import { IS_BROWSER } from '../../common/constants/constants';
import { GlobalContextProvider } from '../../common/context/GlobalContextProvider';
import { store } from '../../common/state/store';
import { NetworkModes } from '../../common/types/network';
import { removeTrailingSlash } from '../../common/utils/utils';
import { Provider as ChakraProvider } from '../../components/ui/provider';
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

export const Providers: FC<{ headerCookies: string | null; children: ReactNode }> = ({
  children,
  headerCookies,
}) => {
  const cookies = headerCookies || (IS_BROWSER ? document?.cookie : '');
  const searchParams = useSearchParams();
  const chain = searchParams?.get('chain');
  const api = searchParams?.get('api');
  const subnet = searchParams?.get('subnet');

  const queryNetworkMode = ((Array.isArray(chain) ? chain[0] : chain) ||
    NetworkModes.Mainnet) as NetworkModes;
  const queryApiUrl = removeTrailingSlash(Array.isArray(api) ? api[0] : api);
  const querySubnet = Array.isArray(subnet) ? subnet[0] : subnet;

  /*
  TODO: rethink the order of the providers. 
  Reasoning:
QueryClientProvider - Should be high in the tree as it manages data fetching and caching that other providers might need
GlobalContextProvider - Global context that should be available to most other providers. However, we should remove this enitrely
ReduxProvider - Global state management that should be available to most other providers
CookiesProvider - Cookie management that authentication and UI might need
Connect - Authentication provider that might need access to state, queries, and cookies
ChakraProvider - UI layer should be innermost as it primarily affects components and might need access to auth state, cookies, etc.
This order ensures that each provider has access to the functionality it might depend on from providers above it in the tree.
  */

  return (
    <GlobalContextProvider headerCookies={headerCookies}>
      <CookiesProvider>
        <ChakraProvider
          // cookies={cookies}
          defaultTheme="light" // TODO: make this dynamic
        >
          <ReduxProvider store={store}>
            <AppConfig // TODO: rename to something else like SessionProvider
              queryNetworkMode={queryNetworkMode}
              queryApiUrl={queryApiUrl}
              querySubnet={querySubnet}
            >
              <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </AppConfig>
          </ReduxProvider>
        </ChakraProvider>
      </CookiesProvider>
    </GlobalContextProvider>
  );
};
