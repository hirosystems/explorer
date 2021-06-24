import React, { useMemo } from 'react';

import { Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';

import { appGetInitialProps } from '@common/app-helpers';
import { useSetNetworkMode } from '@common/hooks/use-set-network-mode';

import type { AppProps } from 'next/app';
import type { NetworkModes } from '@common/types/network';

import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';
import { Provider } from 'jotai';
import { queryClientAtom } from 'jotai/query';
import { queryClient } from 'jotai-query-toolkit';

interface ExporerAppProps extends AppProps {
  networkMode: NetworkModes;
  apiServer: string;
}

function App({ Component, pageProps, networkMode }: ExporerAppProps) {
  const { isHome, fullWidth, dehydratedState, ...props } = pageProps;

  useSetNetworkMode(networkMode);

  return (
    <Provider initialValues={[[queryClientAtom, queryClient] as const]}>
      <Devtools />
      <AppConfig isHome={isHome} fullWidth={fullWidth} dehydratedState={dehydratedState}>
        <Component networkMode={networkMode} {...props} />
      </AppConfig>
    </Provider>
  );
}

App.getInitialProps = appGetInitialProps;

export default App;
