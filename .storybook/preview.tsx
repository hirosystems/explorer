import { ChakraProvider } from '@chakra-ui/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import React from 'react';

import { system } from '../src/ui/theme/theme';
import './preview.css'

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
      <ChakraProvider value={system}>
        <Story w='100%' className='preview-story'/>
      </ChakraProvider>
    ),
    withThemeByClassName({
      defaultTheme: 'light',
      themes: { light: '', dark: 'dark' },
    }),
  ],
};

export default preview;
