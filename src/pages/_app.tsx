import React from 'react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { RootState, initStore } from '@store';

const Fonts = createGlobalStyle`
  html, body, #__next {
    height: 100%;
  }
`;

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
              <link
                href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap"
                rel="stylesheet"
              />
              <title>Stacks 2.0 explorer</title>
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Stacks 2.0 blockchain explorer" />
              <meta name="twitter:card" content="summary" />
              <meta name="twitter:site" content="@blockstack" />
              <meta name="twitter:creator" content="@blockstack" />
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
