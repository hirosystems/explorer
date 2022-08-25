import * as React from 'react';
import * as snippet from '@segment/snippet';

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
import { GlobalStyles, TextAreaOverrides } from '@components/global-styles';
const { SEGMENT_WRITE_KEY, NODE_ENV } = process.env;

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
          {TextAreaOverrides}
          <style
            data-emotion-css={styles.ids.join(' ')}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    };
  }

  renderSnippet() {
    const opts = {
      apiKey: SEGMENT_WRITE_KEY,
      // Note: the page option only covers SSR tracking.
      // Track other events using `window.analytics.page()`
      // in app-config.js if needed later.
      page: true,
    };
    // Use if needed for dev mode
    // if (NODE_ENV !== 'production') return snippet.max(opts);
    return snippet.min(opts);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content="#6287DD" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#6287DD" />
          {NODE_ENV === 'production' && (
            <>
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-NB2VBT0KY2"></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-NB2VBT0KY2');`,
                }}
              />
            </>
          )}
          {/* Inject the Segment snippet into the <head> of the document  */}
          {SEGMENT_WRITE_KEY && (
            <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
          )}
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
