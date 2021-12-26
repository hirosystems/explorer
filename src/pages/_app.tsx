import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';

import { AtomDebug, Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';
import { NetworkMode } from '@common/types/network';
import { getNetworkMode } from '@common/api/network';
import { getServerSideApiServer } from '@common/api/utils';
import { NetworkModeToast } from '@components/network-mode-toast';
import { Modals } from '@components/modals';

interface ExplorerAppProps extends AppProps {
  apiServer: string;
  networkMode: NetworkMode;
}

function ExplorerApp({
  Component,
  apiServer,
  networkMode,
  pageProps: { isHome, fullWidth, ...props },
}: ExplorerAppProps): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    const chain = router.query.chain;
    toast(`You're viewing the ${chain || networkMode} Explorer`);
  }, []);

  return (
    <>
      <Devtools />
      <AppConfig isHome={isHome} fullWidth={fullWidth}>
        <AtomDebug />
        <Component apiServer={apiServer} networkMode={networkMode} {...props} />
        <Modals />
        <NetworkModeToast />
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
