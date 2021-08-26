import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUpdateAtom } from 'jotai/utils';
import { useRouter } from 'next/router';
import { AtomDebug, Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';

import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import type { NetworkMode } from '@common/types/network';

import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';
import { getNetworkMode } from '@common/api/network';
import { getServerSideApiServer } from '@common/api/utils';
import { networkIndexState } from '@store/recoil/network';
import { DEFAULT_NETWORK_INDEX, DEFAULT_TESTNET_INDEX } from '@common/constants';
import { NetworkModeToast } from '@components/network-mode-toast';

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
  const router = useRouter();
  const setUpdateNetworkIndex = useUpdateAtom(networkIndexState);

  useEffect(() => {
    const chainMode = router.query.chain;
    // Make sure the network list is in sync with the query param
    if (chainMode && chainMode === 'testnet') {
      setUpdateNetworkIndex(DEFAULT_TESTNET_INDEX);
    } else {
      setUpdateNetworkIndex(DEFAULT_NETWORK_INDEX);
    }
    toast(`You're viewing the ${chainMode || networkMode} Explorer`);
  }, []);

  return (
    <>
      <Devtools />
      <AppConfig isHome={isHome} fullWidth={fullWidth}>
        <AtomDebug />
        <Component apiServer={apiServer} networkMode={networkMode} {...props} />
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
