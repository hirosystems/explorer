import React from 'react';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import App, { AppContext } from 'next/app';
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
