import React from 'react';
import App, { AppContext } from 'next/app';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { RootState, initStore } from '@store';
import { handleFontLoading } from '@common/fonts';

const GlobalStyles = createGlobalStyle`
@media (prefers-color-scheme: dark) {
  html, body {
    --colors-bg: ${
      // @ts-ignore
      theme.colors.ink
    };
    --colors-bg-alt: #2C2E33;
    --colors-invert: white;
    --colors-text-hover: white;
    --colors-text-title: white;
    --colors-text-caption: ${
      // @ts-ignore
      '#A7A7AD'
    };
    --colors-text-body: ${
      // @ts-ignore
      theme.colors.ink['300']
    };
    --colors-border: ${
      'rgb(39, 41, 46)'
    };
    background: var(--colors-bg);
  }
}
@media (prefers-color-scheme: light) {
  html, body {
    --colors-bg: white;
    --colors-bg-alt: #2C2E33;
    --colors-invert: ${
      // @ts-ignore
      theme.colors.ink
    };
    --colors-text-title: ${
      // @ts-ignore
      theme.colors.ink
    };
    --colors-text-caption: ${
      // @ts-ignore
      theme.colors.ink['600']
    };
    --colors-text-body: ${
      // @ts-ignore
      theme.colors.ink['900']
    };
    --colors-border: ${
      // @ts-ignore
      theme.colors.ink['600']
    };
  }
}
  html, body, #__next {
    height: 100%;
    background: var(--colors-bg);
    border-color: var(--colors-border);
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
