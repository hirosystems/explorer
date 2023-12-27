'use client';

import { tagAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const multiStyleConfigHelpers = createMultiStyleConfigHelpers(tagAnatomy.keys);

const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
  label: {
    fontSize: 'xs',
  },
  container: {
    rounded: 'full',
    bg: 'whiteAlpha.400',
    color: 'white',
  },
}));

export const tagTheme = multiStyleConfigHelpers.defineMultiStyleConfig({ baseStyle });
