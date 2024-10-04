import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { Preview } from '@storybook/react';
import React from 'react';

import { theme } from '../src/ui/theme/theme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    Story => (
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;
