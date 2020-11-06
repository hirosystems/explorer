import React from 'react';
import dynamic from 'next/dynamic';
import { theme } from '@stacks/ui';
import { ThemeProvider } from '@emotion/react';
import { ProgressBar } from '@components/progress-bar';
import { ColorModeProvider } from '@components/color-modes';

import { useDispatch } from 'react-redux';
import { appTime } from '@store/ui/actions';
import { useDocumentVisibility } from 'web-api-hooks';

import { useInterval } from 'react-use';

const Toaster = dynamic(() => import('../components/toaster'), { ssr: false });

export const AppWrapper: React.FC<{ colorMode?: 'light' | 'dark' }> = React.memo(
  ({ children, colorMode }) => {
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

    return (
      <>
        <ThemeProvider theme={theme}>
          <ColorModeProvider colorMode={colorMode}>
            <ProgressBar />
            <>{children}</>
            <Toaster />
          </ColorModeProvider>
        </ThemeProvider>
      </>
    );
  }
);
