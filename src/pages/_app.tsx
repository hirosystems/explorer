import React from 'react';
import { AppContext } from 'next/app';
import { wrapper } from '@store';
import { AppWrapper } from '@components/app-init';
import { parseCookies } from 'nookies';

interface MyAppProps {
  colorMode?: 'light' | 'dark';
}

// @ts-ignore
const MyApp = wrapper.withRedux(({ Component, pageProps, colorMode, store, ctx, ...rest }) => {
  return (
    <AppWrapper colorMode={colorMode}>
      <Component {...pageProps} />
    </AppWrapper>
  );
});

// @ts-ignore
MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  const cookies = parseCookies(ctx);
  if (cookies && cookies.color_mode) {
    return {
      ...pageProps,
      colorMode: JSON.parse(cookies.color_mode),
    };
  }
  return { pageProps };
};

export default MyApp;
