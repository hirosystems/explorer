export const Fonts = () => (
  <>
    <meta name="color-scheme" content="light dark" />
    <link
      rel="preload"
      href="/static/fonts/soehne-mono-web-buch.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="true"
    />
    <link
      rel="preload"
      href="/static/fonts/soehne-web-buch.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="true"
    />
    <link
      rel="preload"
      href="/static/fonts/soehne-web-kraftig_1.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="true"
    />
    <link
      rel="preload"
      href="/static/fonts/soehne-web-halbfett_1.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="true"
    />
    <style
      dangerouslySetInnerHTML={{
        __html: `@font-face {
  font-family: 'Soehne Mono';
  src: url('/static/fonts/soehne-mono-web-buch.woff2') format('woff2'),
       url('/static/fonts/soehne-mono-web-buch.woff') format('woff');
  font-weight: 400;
  font-display: swap;
  font-style: normal;
}
@font-face {
  font-family: 'Soehne';
  src: url('/static/fonts/soehne-web-buch.woff2') format('woff2'),
       url('/static/fonts/soehne-web-buch.woff') format('woff');
  font-weight: 400;
  font-display: swap;
  font-style: normal;
}
@font-face {
    font-family: 'Soehne';
  src: url('/static/fonts/soehne-web-kraftig_1.woff2') format('woff2'),
       url('/static/fonts/soehne-web-kraftig_1.woff') format('woff');
  font-weight: 500;
  font-display: swap;
  font-style: normal;
}
@font-face {
    font-family: 'Soehne';
  src: url('/static/fonts/soehne-web-halbfett_1.woff2') format('woff2'),
       url('/static/fonts/soehne-web-halbfett_1.woff') format('woff');
  font-weight: 600;
  font-display: swap;
  font-style: normal;
}
`,
      }}
    />
  </>
);
