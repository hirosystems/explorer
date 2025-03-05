import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React, { useEffect } from 'react';

import { Providers } from '../src/app/_components/Providers';
import {
  instrumentSans,
  inter,
  matterMonoRegular,
  matterRegular,
  openSauce,
} from '../src/common/fonts';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color mode selector',
      toolbar: {
        title: 'Color mode',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextRouter: {
      Provider: AppRouterContext.Provider,
      pathname: '/',
      asPath: '/',
      query: {},
      push() {},
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = context.globals.theme || 'light';
      useEffect(() => {
        const html = document.querySelector('html');
        if (html) {
          html.classList.remove('light', 'dark');
          html.classList.add(selectedTheme);
          const docsStory = document.querySelector('.docs-story');
          if (docsStory) {
            docsStory.setAttribute(
              'style',
              `background-color: ${selectedTheme === 'dark' ? '#0C0C0D' : '#fff'} !important;`
            );
          }
        }
      }, [selectedTheme]);
      return (
        <Providers addedCustomNetworksCookie={undefined} removedCustomNetworksCookie={undefined}>
          <main
            className={`${inter.variable} ${instrumentSans.variable} ${openSauce.variable} ${matterRegular.variable} ${matterMonoRegular.variable}`}
          >
            <Story w="100%" className="preview-story" />
          </main>
        </Providers>
      );
    },
    withThemeByClassName({
      defaultTheme: 'light',
      themes: {
        light: '',
        dark: 'dark',
      },
    }),
  ],
};

export default preview;
