import React from 'react';
import App, { AppContext } from 'next/app';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { RootState, initStore } from '@store';
import { handleFontLoading } from '@common/fonts';
import { ProgressBar } from '@components/progress-bar';
import { parseCookies } from 'nookies';
import { ColorModeProvider } from '@components/color-modes';

const GlobalStyles = createGlobalStyle`
  html, body, #__next {
    height: 100%;
  }
  .prism-code *::selection{
    background-color: #AAB3FF;
    color: white !important;
  }
`;

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

  async componentDidMount() {
    await handleFontLoading();
  }

  render() {
    const { Component, pageProps, colorMode, store } = this.props;
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ColorModeProvider colorMode={colorMode}>
            <CSSReset />
            <GlobalStyles />
            <ProgressBar />
            <Component {...pageProps} />
          </ColorModeProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withRedux(initStore)(MyApp);
