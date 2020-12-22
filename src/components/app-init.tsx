/** @jsxRuntime classic */
import React from 'react';
import { ThemeProvider } from '@stacks/ui';
import { ProgressBar } from '@components/progress-bar';
import { ColorModeProvider } from '@components/color-modes';

export const AppWrapper: React.FC<{ colorMode?: 'light' | 'dark' }> = React.memo(
  ({ children, colorMode }) => {
    return (
      <>
        <ThemeProvider>
          <ColorModeProvider colorMode={colorMode}>
            <ProgressBar />
            <>{children}</>
          </ColorModeProvider>
        </ThemeProvider>
      </>
    );
  }
);
