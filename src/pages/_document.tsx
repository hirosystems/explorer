import Document, { DocumentContext, DocumentInitialProps } from 'next/document';
import { extractCritical } from '@emotion/server';
import {
  GlobalStyles,
  ProgressBarStyles,
  TextAreaOverrides,
  ColorModes,
} from '@components/global-styles';

export default class MyDocument extends Document {
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
}
