'use client';

import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const multiStyleConfigHelpers = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
  control: {
    _checked: {
      bg: mode(`brand.light`, `brand.dark`)(props),
      borderColor: mode(`brand.light`, `brand.dark`)(props),
      _hover: {
        bg: mode(`brand.light`, `brand.dark`)(props),
        borderColor: mode(`brand.light`, `brand.dark`)(props),
      },
    },
  },
}));

export const checkboxTheme = multiStyleConfigHelpers.defineMultiStyleConfig({ baseStyle });
