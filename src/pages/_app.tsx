import React from 'react';
import App, { AppContext } from 'next/app';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import { RootState, initStore } from '@store';
import { AppWrapper } from '@components/app-init';
import { parseCookies } from 'nookies';
import getConfig from 'next/config';
import { setNetworks } from '@store/ui/actions';

interface MyAppProps {
  colorMode?: 'light' | 'dark';
}

// @ts-ignore
class MyApp extends App<MyAppProps & ReduxWrapperAppProps<RootState>> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const { serverRuntimeConfig } = getConfig();
    const { MOCKNET_API_SERVER, TESTNET_API_SERVER } = serverRuntimeConfig;

    if (ctx.res) {
      await ctx.store.dispatch(
        setNetworks({
          MOCKNET: MOCKNET_API_SERVER,
          TESTNET: TESTNET_API_SERVER,
        })
      );
    }
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    const cookies = parseCookies(ctx);
    if (cookies) {
      const colorMode = cookies.color_mode ? JSON.parse(cookies.color_mode) : undefined;
      const apiServer = cookies.api_server ? JSON.parse(cookies.api_server) : undefined;
      return {
        ...pageProps,
        colorMode,
        apiServer,
      };
    }
    return { pageProps };
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
