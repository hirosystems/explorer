import React from 'react';
import App, { AppContext } from 'next/app';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { RootState, initStore } from '@store';
import { handleFontLoading } from '@common/fonts';
import '@common/clarity-language-definition';
import { ColorModes } from '@components/color-modes';

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
            <CSSReset />
            <ColorModes />
            <GlobalStyles />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withRedux(initStore)(MyApp);
