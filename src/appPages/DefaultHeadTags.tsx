import snippet from '@segment/snippet';
import Script from 'next/script';

const { SEGMENT_WRITE_KEY, NODE_ENV } = process.env;
const description =
  'Explore transactions and accounts on the Stacks blockchain. Clone any contract and experiment in your browser with the Explorer sandbox.';

function GA() {
  if (NODE_ENV !== 'production') return null;
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-NB2VBT0KY2" />
      <Script
        id="stacks-ga-snippet"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);};
                gtag('js', new Date());
                gtag('config', 'G-NB2VBT0KY2');`,
        }}
      />
    </>
  );
}

export function DefaultHeadTags() {
  return (
    <>
      <meta name="theme-color" content="#6287DD" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#6287DD" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="explorer.hiro.so" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@stacks" />
      <meta name="twitter:creator" content="@stacks" />
      <meta
        property="og:image"
        content="https://blockstack-www.imgix.net/stacks-explorer-og.png?auto=format,compress"
      />
      <meta
        name="twitter:image"
        content="https://blockstack-www.imgix.net/stacks-explorer-og.png?auto=format,compress"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@stacks" />
      <meta property="og:description" content={description} />
      <link rel="icon" type="image/svg+xml" href="/static/favicon.png" />

      <GA />
      {SEGMENT_WRITE_KEY && (
        <Script
          id="stacks-segment"
          dangerouslySetInnerHTML={{
            __html: snippet.min({
              apiKey: SEGMENT_WRITE_KEY,
              page: true,
            }),
          }}
        />
      )}
      <link rel="preconnect" href="https://fonts.gstatic.com" />
    </>
  );
}
