import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';
import { ProgressBar } from '@components/progress-bar';
import { ColorModeProvider } from '@components/color-modes';

import { useDispatch } from 'react-redux';
import { appTime } from '@store/ui/actions';
import { useDocumentVisibility } from 'web-api-hooks';
import { handleFontLoading } from '@common/fonts';
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
  const [fontsLoaded, setLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const visibility = useDocumentVisibility();
  const isVisible = visibility === 'visible';

  React.useEffect(() => {
    if (!fontsLoaded) handleFontLoading().then(() => setLoaded(true));
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
