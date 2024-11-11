'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

// const multiStyleConfigHelpers = createMultiStyleConfigHelpers(tagAnatomy.keys);

// const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
//   label: {
//     fontSize: 'xs',
//   },
//   container: {
//     rounded: 'full',
//     bg: 'whiteAlpha.400',
//     color: 'white',
//   },
// }));

// export const tagTheme = multiStyleConfigHelpers.defineMultiStyleConfig({ baseStyle });

export const tagSlotRecipe = defineSlotRecipe({
  className: 'tag',
  slots: ['label', 'container'],
  base: {
    label: {
      fontSize: 'xs',
    },
    container: {
      rounded: 'full',
      bg: 'whiteAlpha.400',
      color: 'white',
    },
  },
});
