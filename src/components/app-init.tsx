import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';
import { ProgressBar } from '@components/progress-bar';
import { ColorModeProvider } from '@components/color-modes';

import { useDispatch } from 'react-redux';
import { appTime } from '@store/ui/actions';
import { useDocumentVisibility } from 'web-api-hooks';

import { useInterval } from 'react-use';

const Toaster = dynamic(() => import('../components/toaster'), { ssr: false });

const delay = 20000;

const GlobalStyles = createGlobalStyle`
  html, body, #__next {
    height: 100%;
  }
  .prism-code *::selection{
    background-color: #AAB3FF;
    color: white !important;
  }
  
  .portal{
  position: relative;
  z-index: 99;
  }
`;

export const AppWrapper: React.FC<{ colorMode?: 'light' | 'dark' }> = ({ children, colorMode }) => {
  const dispatch = useDispatch();
  const visibility = useDocumentVisibility();
  const isVisible = visibility === 'visible';

  React.useEffect(() => {
    // enable Fathom tracking in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      const tracker = window.document.createElement('script');
      const firstScript = window.document.getElementsByTagName('script')[0];
      tracker.defer = true;
      tracker.setAttribute('site', `MVHUUREV`);
      tracker.setAttribute('spa', 'auto');
      tracker.src = 'https://cdn.usefathom.com/script.js';

      firstScript.parentNode!.insertBefore(tracker, firstScript);
    }
  }, []);

  const handleAppTime = React.useCallback(() => {
    dispatch(appTime());
  }, []);

  useInterval(handleAppTime, isVisible ? delay : null);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ColorModeProvider colorMode={colorMode}>
          <CSSReset />
          <GlobalStyles />
          <ProgressBar />
          <>{children}</>
          <Toaster />
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
};
