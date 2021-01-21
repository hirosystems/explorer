import React from 'react';
import { AppConfig } from '@components/app-config';

import { appGetInitialProps } from '@common/app-helpers';
import { useSetNetworkMode } from '@common/hooks/use-set-network-mode';
import { useFathom } from '@common/hooks/use-fathom';

import type { AppProps } from 'next/app';
import type { NetworkModes } from '@common/types/network';

import './styles.css';
import 'tippy.js/dist/tippy.css'; // optional
import 'modern-normalize/modern-normalize.css';

interface MyAppProps extends AppProps {
  networkMode: NetworkModes;
}

/**
 * WDYR (why-did-you-render) helps locate unnecessary re-renders and fix them
 * Applied in development environment, on the frontend only, if the env param 'WDYR' === 'true'
 *
 * @see https://github.com/welldone-software/why-did-you-render
 */
if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development' &&
  process.env.WDYR === 'true'
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  // eslint-disable-next-line no-console
  console.debug(
    'Applying whyDidYouRender, to help you locate unnecessary re-renders during development. See https://github.com/welldone-software/why-did-you-render'
  );
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

function MyApp({ Component, pageProps, networkMode }: MyAppProps) {
  const { isHome, dehydratedState, ...props } = pageProps;

  useSetNetworkMode(networkMode);
  useFathom();

  return (
    <AppConfig isHome={isHome} dehydratedState={dehydratedState}>
      <Component {...props} />
    </AppConfig>
  );
}

MyApp.getInitialProps = appGetInitialProps;

export default MyApp;
