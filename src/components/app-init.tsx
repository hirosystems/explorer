import React from 'react';

import { ColorModeProvider, ThemeProvider } from '@stacks/ui';

import { PageWrapper } from '@components/page';

export const AppWrapper: React.FC = React.memo(props => (
  <ThemeProvider>
    <ColorModeProvider defaultMode="light">
      <PageWrapper {...props} />
    </ColorModeProvider>
  </ThemeProvider>
));
