'use client';

import { defineRecipe } from '@chakra-ui/react';

// export const linkTheme = defineStyleConfig({
//   variants: {
//     aTag: defineStyle(props => ({
//       textDecoration: 'underline',
//       color: 'purple.600',
//       _hover: {
//         textDecoration: 'none',
//       },
//     })),
//     noUnderline: defineStyle({
//       textDecoration: 'none',
//       _hover: {
//         textDecoration: 'none',
//       },
//     }),
//   },
// });

export const linkRecipe = defineRecipe({
  className: 'link',
  base: {},
  variants: {
    type: {
      aTag: {
        textDecoration: 'underline',
        color: 'purple.600',
        _hover: {
          textDecoration: 'none',
        },
      },
      noUnderline: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
});
