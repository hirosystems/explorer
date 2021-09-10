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
          <meta name="theme-color" content="#9146FF" media="(prefers-color-scheme: light)" />
          <meta name="theme-color" content="#4B2581" media="(prefers-color-scheme: dark)" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#9146FF" />
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
        </Head>
        <body>
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "313f5f807c234f029e2b171356b38a81"}'
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
