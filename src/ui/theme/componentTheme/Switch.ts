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
    bg: mode(`slate.200`, `slate.800`)(props),
    _checked: {
      bg: mode(`purple.600`, `purple.400`)(props),
    },
  },
}));

export const switchTheme = multiStyleConfigHelpers.defineMultiStyleConfig({ baseStyle });
