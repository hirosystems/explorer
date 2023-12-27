'use client';

import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const multiStyleConfigHelpers = createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
  thumb: {
    bg: mode(`white`, `black`)(props),
  },
  track: {
    bg: mode(`slate.300`, `slate.800`)(props),
    _checked: {
      bg: `purple.500`,
    },
  },
}));

export const switchTheme = multiStyleConfigHelpers.defineMultiStyleConfig({ baseStyle });
