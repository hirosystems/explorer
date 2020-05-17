import React from 'react';
import App, { AppContext } from 'next/app';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import { RootState, initStore } from '@store';
import { AppWrapper } from '@components/app-init';
import { parseCookies } from 'nookies';
import getConfig from 'next/config';
import { selectNetwork, setNetworks } from '@store/ui/actions';
import { COLOR_MODE_COOKIE, NETWORK_COOKIE } from '@common/utils';

interface MyAppProps {
  colorMode?: 'light' | 'dark';
}

// @ts-ignore
class MyApp extends App<MyAppProps & ReduxWrapperAppProps<RootState>> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const { serverRuntimeConfig } = getConfig();
    const { MOCKNET_API_SERVER, TESTNET_API_SERVER } = serverRuntimeConfig;

    let colorMode = undefined;
    let apiServer = undefined;

    if (ctx.res) {
      await ctx.store.dispatch(
        setNetworks({
          MOCKNET: MOCKNET_API_SERVER,
          TESTNET: TESTNET_API_SERVER,
        })
      );
      const cookies = parseCookies(ctx);

      if (cookies) {
        colorMode = cookies[COLOR_MODE_COOKIE] ? JSON.parse(cookies[COLOR_MODE_COOKIE]) : undefined;
        apiServer = cookies[NETWORK_COOKIE] ? JSON.parse(cookies[NETWORK_COOKIE]) : undefined;
      }

      if (apiServer) {
        await ctx.store.dispatch(selectNetwork(JSON.parse(cookies[NETWORK_COOKIE])));
      }
    }

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps, colorMode, apiServer };
  }

  render() {
    const { Component, pageProps, colorMode, store } = this.props;
    return (
      <Provider store={store}>
        <AppWrapper colorMode={colorMode}>
          <Component {...pageProps} />
        </AppWrapper>
      </Provider>
    );
  }
}

export default withRedux(initStore)(MyApp);
