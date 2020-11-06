import * as React from 'react';

import Document, {
  DocumentContext,
  DocumentProps,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { extractCritical } from '@emotion/server';
import {
  GlobalStyles,
  ProgressBarStyles,
  TextAreaOverrides,
  ColorModes,
} from '@components/global-styles';
export const THEME_STORAGE_KEY = 'theme';

export default class MyDocument extends Document<DocumentProps> {
  static async getInitialProps({ renderPage }: DocumentContext): Promise<DocumentInitialProps> {
    const page = await renderPage();
    const styles = extractCritical(page.html);
    return {
      ...page,
      styles: (
        <>
          {GlobalStyles}
          {ProgressBarStyles}
          {TextAreaOverrides}
          {ColorModes}
          <style
            data-emotion-css={styles.ids.join(' ')}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    };
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
try {
    var mode = localStorage.getItem('${THEME_STORAGE_KEY}')
    if (!mode) return
    document.documentElement.classList.add(mode)
    var bgValue = getComputedStyle(document.documentElement)
    .getPropertyValue('--colors-bg')
    document.documentElement.style.background = bgValue
} catch (e) {}
})()`,
            }}
          />

          <link rel="preconnect" href="https://cdn.usefathom.com" crossOrigin="true" />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
