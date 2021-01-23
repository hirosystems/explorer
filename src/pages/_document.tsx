import * as React from 'react';

import Document, {
  DocumentContext,
  DocumentInitialProps,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { extractCritical } from '@emotion/server';
import { GlobalStyles, ProgressBarStyles, TextAreaOverrides } from '@components/global-styles';

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
          <meta name="theme-color" content="#6287DD" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#6287DD" />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function () {
  try {
    var mode = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (!mode) {
      document.documentElement.classList.add('light');
      var bgValue = getComputedStyle(document.documentElement).getPropertyValue('--colors-bg');
      document.documentElement.style.background = bgValue;
    } else {
      document.documentElement.classList.add(mode);
      var bgValue = getComputedStyle(document.documentElement).getPropertyValue('--colors-bg');
      document.documentElement.style.background = bgValue;
    }
  } catch (e) {}
})();`,
            }}
          />
          <link rel="preconnect" href="https://cdn.usefathom.com" crossOrigin="true" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
