import React from 'react';
import App, { AppContext } from 'next/app';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import { RootState, initStore } from '@store';
import { AppWrapper } from '@components/app-init';
import { parseCookies } from 'nookies';

interface MyAppProps {
  colorMode?: 'light' | 'dark';
}

// @ts-ignore
class MyApp extends App<MyAppProps & ReduxWrapperAppProps<RootState>> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    const cookies = parseCookies(ctx);
    if (cookies && cookies.color_mode) {
      return {
        ...pageProps,
        colorMode: JSON.parse(cookies.color_mode),
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
