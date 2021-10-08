import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Script from 'next/script';
import * as snippet from '@segment/snippet';
import { AtomDebug, Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';

import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { NetworkMode } from '@common/types/network';

import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';
import { getNetworkMode } from '@common/api/network';
import { getServerSideApiServer } from '@common/api/utils';
import { NetworkModeToast } from '@components/network-mode-toast';
import { Modals } from '@components/modals';

function renderSnippet() {
  const opts = {
    apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    // The page option only covers SSR tracking. AppConfig.tsx is
    // used to track other events using `window.analytics.page()`
    page: true,
  };

  if (process.env.NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

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
        {/* Inject the Segment snippet into the <head> of the document  */}
        <Script dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
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
