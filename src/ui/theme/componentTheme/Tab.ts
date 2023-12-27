'use client';

import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, useColorMode } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const multiStyleConfigHelpers = createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
  root: {
    minWidth: 0,
  },
  tabpanel: {},
  tablist: {
    py: '6',
    borderBottom: '1px',
    borderColor: mode(`slate.150`, `slate.900`)(props),
  },
  tab: {
    color: 'slate.700',
    borderRadius: 'lg',
    fontSize: 'sm',
    _selected: {
      bg: mode(`slate.150`, `slate.900`)(props),
      color: mode(`slate.900`, `slate.50`)(props),
    },
  },
}));

export const tabTheme = multiStyleConfigHelpers.defineMultiStyleConfig({
  variants: {
    'soft-rounded': baseStyle,
  },
});
