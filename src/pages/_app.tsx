import React from 'react';
import App, { AppContext } from 'next/app';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { RootState, initStore } from '@store';
import { handleFontLoading } from '@common/fonts';
import '@common/clarity-language-definition';

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
    --colors-border: ${'rgb(39, 41, 46)'};
    background: var(--colors-bg);
  }
}
@media (prefers-color-scheme: light) {
  html, body {
    --colors-bg: white;
    --colors-bg-alt: ${
      // @ts-ignore
      theme.colors.ink['50']
    };
    --colors-invert: ${
      // @ts-ignore
      theme.colors.ink
    };
    --colors-text-hover: ${
      // @ts-ignore
      theme.colors.blue
    };

    --colors-text-title: ${
      // @ts-ignore
      theme.colors.ink
    };
    --colors-text-caption: ${
      // @ts-ignore
      theme.colors.ink['400']
    };
    --colors-text-body: ${
      // @ts-ignore
      theme.colors.ink['900']
    };
    --colors-border: rgb(229, 229, 236);
  }
}
  html, body, #__next {
    height: 100%;
    background: var(--colors-bg);
    border-color: var(--colors-border);
  }
  
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--colors-text-body);
    font-size: 16px !important;
    transition: background-color 5000s ease-in-out 0s;
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
