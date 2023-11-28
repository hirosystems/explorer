import Script from 'next/script';

import { NODE_ENV } from '../../common/constants/env';

export function GA() {
  if (NODE_ENV !== 'production') return null;
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-NB2VBT0KY2"></Script>
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
