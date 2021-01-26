import React from 'react';
import { ColorModeProvider, ThemeProvider } from '@stacks/ui';
import { ProgressBar } from '@components/progress-bar';
import { PageWrapper } from '@components/page';
import { Modals } from '@components/modals';

export const AppWrapper: React.FC<{ isHome?: boolean; fullWidth?: boolean }> = React.memo(props => (
  <ThemeProvider>
    <ColorModeProvider defaultMode="light">
      <ProgressBar />
      <PageWrapper {...props} />
      <Modals />
    </ColorModeProvider>
  </ThemeProvider>
));
