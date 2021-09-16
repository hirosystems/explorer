import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUpdateAtom } from 'jotai/utils';
import { useRouter } from 'next/router';
import { AtomDebug, Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';

import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { NetworkMode } from '@common/types/network';

import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';
import { getNetworkMode } from '@common/api/network';
import { getSavedNetworkIndex, getServerSideApiServer } from '@common/api/utils';
import { networkIndexState } from '@store/recoil/network';
import {
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  DEFAULT_TESTNET_INDEX,
} from '@common/constants';
import { NetworkModeToast } from '@components/network-mode-toast';
import { Modals } from '@components/modals';

interface ExplorerAppProps extends AppProps {
  networkMode: NetworkMode;
  apiServer: string;
  savedNetworkIndex: number;
}

function ExplorerApp({
  Component,
  networkMode,
  apiServer,
  savedNetworkIndex,
  pageProps: { isHome, fullWidth, ...props },
}: ExplorerAppProps) {
  const router = useRouter();
  const setNetworkIndex = useUpdateAtom(networkIndexState);

  useEffect(() => {
    const chainMode = router.query.chain;
    // Check if using a default network
    if (savedNetworkIndex < DEFAULT_NETWORK_LIST.length) {
      // Make sure the network list is in sync with the query param
      if (chainMode && chainMode === 'testnet') {
        void setNetworkIndex(DEFAULT_TESTNET_INDEX);
      } else {
        void setNetworkIndex(DEFAULT_NETWORK_INDEX);
      }
    } else {
      // This will keep a user on a custom network if it was
      // the last network used
      void setNetworkIndex(savedNetworkIndex);
    }
    toast(`You're viewing the ${chainMode || networkMode} Explorer`);
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
  const [appProps, apiServer, savedNetworkIndex] = await Promise.all([
    App.getInitialProps(appContext),
    getServerSideApiServer(appContext.ctx),
    getSavedNetworkIndex(appContext.ctx),
  ]);
  const networkMode = await getNetworkMode(apiServer);
  return {
    apiServer,
    savedNetworkIndex,
    networkMode,
    ...appProps,
  };
};

export default ExplorerApp;
