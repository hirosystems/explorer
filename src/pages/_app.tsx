import React from 'react';

import { AtomDebug, Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';

import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import type { NetworkMode } from '@common/types/network';

import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';
import { getNetworkMode } from '@common/api/network';
import { getServerSideApiServer } from '@common/api/utils';

interface ExplorerAppProps extends AppProps {
  networkMode: NetworkMode;
  apiServer: string;
}

function ExplorerApp({
  Component,
  networkMode,
  apiServer,
  pageProps: { isHome, fullWidth, ...props },
}: ExplorerAppProps) {
  return (
    <>
      <Devtools />
      <AppConfig isHome={isHome} fullWidth={fullWidth}>
        <AtomDebug />
        <Component apiServer={apiServer} networkMode={networkMode} {...props} />
      </AppConfig>
    </>
  );
}

ExplorerApp.getInitialProps = async (appContext: AppContext) => {
  const [appProps, apiServer] = await Promise.all([
    App.getInitialProps(appContext),
    getServerSideApiServer(appContext.ctx),
  ]);
  const networkMode = await getNetworkMode(apiServer);
  return {
    apiServer,
    networkMode,
    ...appProps,
  };
};

export default ExplorerApp;
