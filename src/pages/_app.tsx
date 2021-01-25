import React from 'react';
import { AppConfig } from '@components/app-config';

import { appGetInitialProps } from '@common/app-helpers';
import { useSetNetworkMode } from '@common/hooks/use-set-network-mode';
import { useFathom } from '@common/hooks/use-fathom';

import type { AppProps } from 'next/app';
import type { NetworkModes } from '@common/types/network';

import 'tippy.js/dist/tippy.css'; // optional
import 'modern-normalize/modern-normalize.css';

interface MyAppProps extends AppProps {
  networkMode: NetworkModes;
}

function MyApp({ Component, pageProps, networkMode }: MyAppProps) {
  const { isHome, dehydratedState, ...props } = pageProps;

  useSetNetworkMode(networkMode);
  useFathom();

  return (
    <AppConfig isHome={isHome} dehydratedState={dehydratedState}>
      <Component networkMode={networkMode} {...props} />
    </AppConfig>
  );
}

MyApp.getInitialProps = appGetInitialProps;

export default MyApp;
