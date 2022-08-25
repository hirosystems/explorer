import React from 'react';
import { ColorModeProvider, ThemeProvider } from '@stacks/ui';
import { PageWrapper } from '@components/page';

export const AppWrapper: React.FC<{ isHome?: boolean; fullWidth?: boolean }> = React.memo(props => (
  <ThemeProvider>
    <ColorModeProvider defaultMode="light">
      <PageWrapper {...props} />
    </ColorModeProvider>
  </ThemeProvider>
));
