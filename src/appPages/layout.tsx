import { cookies } from 'next/headers';
import { PageWrapper } from '@/appPages/PageWrapper';

import { Providers } from './Providers';
// import './global-style/code-editor.css';
// import './global-style/global.css';
// import './global-style/prism-theme.css';

const colorModeCookieName = 'chakra-ui-color-mode';

export default function RootLayout({ children }: any) {
  const colorModeCookie = cookies().get(colorModeCookieName) || {
    name: colorModeCookieName,
    value: 'light',
  };
  return (
    <html lang="en">
      <head />
      <body>
        <Providers colorModeCookie={`${colorModeCookie.name}=${colorModeCookie.value}`}>
          <PageWrapper>{children}</PageWrapper>
        </Providers>
      </body>
    </html>
  );
}
