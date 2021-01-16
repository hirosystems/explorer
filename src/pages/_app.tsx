import React, { memo } from 'react';
import { AppConfig } from '@components/app-config';

import { appGetInitialProps } from '@common/app-helpers';
import { useSetNetworkMode } from '@common/hooks/use-set-network-mode';

import type { AppProps } from 'next/app';
import type { NetworkModes } from '@common/types/network';

import './styles.css';
import 'tippy.js/dist/tippy.css'; // optional
import 'modern-normalize/modern-normalize.css';

interface MyAppProps extends AppProps {
  networkMode: NetworkModes;
}

function MyApp({ Component, pageProps, networkMode }: MyAppProps) {
  useSetNetworkMode(networkMode);
  const { isHome, ...props } = pageProps;
  return (
    <AppConfig isHome={isHome}>
      <Component {...props} />
    </AppConfig>
  );
}

MyApp.getInitialProps = appGetInitialProps;

export default memo(MyApp);
