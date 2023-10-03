import { extractCritical } from '@emotion/server';
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

import { GlobalStyles, PrismTheme, TextAreaOverrides } from '../global-styles';

const { SEGMENT_WRITE_KEY, NODE_ENV } = process.env;

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
          {PrismTheme}
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
      page: true,
    };
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
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-NB2VBT0KY2" />
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
          {SEGMENT_WRITE_KEY && (
            <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
          )}
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
