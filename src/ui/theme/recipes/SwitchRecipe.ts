'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

// const multiStyleConfigHelpers = createMultiStyleConfigHelpers(switchAnatomy.keys);

// const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
//   thumb: {
//     bg: mode(`white`, `black`)(props),
//   },
//   track: {
//     bg: mode(`slate.200`, `slate.800`)(props),
//     _checked: {
//       bg: mode(`purple.600`, `purple.400`)(props),
//     },
//   },
// }));

// export const switchTheme = multiStyleConfigHelpers.defineMultiStyleConfig({ baseStyle });

export const switchSlotRecipe = defineSlotRecipe({
  className: 'switch',
  slots: ['thumb', 'track'],
  base: {
    thumb: {
      bg: { base: 'white', _dark: 'black' },
    },
    track: {
      bg: { base: 'slate.200', _dark: 'slate.800' },
      _checked: {
        bg: { base: 'purple.600', _dark: 'purple.400' },
      },
    },
  },
});
