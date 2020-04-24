import React from 'react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { RootState, initStore } from '@store';
import { handleFontLoading } from '@common/fonts';

const GlobalStyles = createGlobalStyle`
  html, body, #__next {
    height: 100%;
  }
  .prism-code *::selection{
    background-color: #AAB3FF;
    color: white !important;
  }
`;

class MyApp extends App<ReduxWrapperAppProps<RootState>> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  async componentDidMount() {
    await handleFontLoading();
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <>
            <Head>
              <title>Stacks 2.0 explorer</title>
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Stacks 2.0 blockchain explorer" />
              <meta name="twitter:card" content="summary" />
              <meta name="twitter:site" content="@blockstack" />
              <meta name="twitter:creator" content="@blockstack" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
            </Head>
            <GlobalStyles />
            <CSSReset />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withRedux(initStore)(MyApp);
