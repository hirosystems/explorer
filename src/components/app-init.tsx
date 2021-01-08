import React from 'react';
import { ColorModeProvider, ThemeProvider } from '@stacks/ui';
import { ProgressBar } from '@components/progress-bar';
import { PageWrapper } from '@components/page';
import { Modals } from '@components/modals';

export const AppWrapper: React.FC<{ isHome?: boolean }> = React.memo(({ children, isHome }) => (
  <ThemeProvider>
    <ColorModeProvider defaultMode="light">
      <ProgressBar />
      <PageWrapper isHome={isHome}>{children}</PageWrapper>
      <Modals />
    </ColorModeProvider>
  </ThemeProvider>
));
