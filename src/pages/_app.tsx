import React from 'react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

const Fonts = createGlobalStyle`@import url('https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap');`;

import { RootState, initStore } from '@store';

class MyApp extends App<ReduxWrapperAppProps<RootState>> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <>
            <Head>
              <title>Stacks 2.0 explorer</title>
            </Head>
            <Fonts />
            <CSSReset />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withRedux(initStore)(MyApp);
