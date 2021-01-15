import type { AppContext } from 'next/app';

import { getServerSideApiServer } from '@common/api/utils';
import { getNetworkMode } from '@common/api/network';
import { atom } from 'recoil';
import App from 'next/app';

/**
 * This is an awful hack that will hopefully be removed in the future
 *
 * With Recoil and SSR, setting an initial value on the server is not easy nor straightforward.
 * @see https://github.com/facebookexperimental/Recoil/issues/750
 * @see https://gist.github.com/spro/280e06758099a05b3bfb6e876e919f2e
 */

let CURRENT_NETWORK_MODE: any = null;

const initialEffect = (key: string) => ({ setSelf }: any) => {
  if (CURRENT_NETWORK_MODE !== null) setSelf(CURRENT_NETWORK_MODE);
};

export const setCurrentNetworkMode = (networkMode: any) => {
  CURRENT_NETWORK_MODE = networkMode;
};

export const networkModeState = atom({
  key: 'app/network.mode',
  default: null,
  effects_UNSTABLE: [initialEffect('network.mode')],
});

export const appGetInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  try {
    const apiServer = await getServerSideApiServer(appContext.ctx);
    const networkMode = await getNetworkMode(apiServer);
    return { networkMode, ...appProps };
  } catch (e) {
    return { ...appProps };
  }
};
