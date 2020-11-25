/** @jsxRuntime classic */
import React from 'react';
import { theme } from '@stacks/ui';
import { ThemeProvider } from '@emotion/react';
import { ProgressBar } from '@components/progress-bar';
import { ColorModeProvider } from '@components/color-modes';

export const AppWrapper: React.FC<{ colorMode?: 'light' | 'dark' }> = React.memo(
  ({ children, colorMode }) => {
    return (
      <>
        <ThemeProvider theme={theme}>
          <ColorModeProvider colorMode={colorMode}>
            <ProgressBar />
            <>{children}</>
          </ColorModeProvider>
        </ThemeProvider>
      </>
    );
  }
);
