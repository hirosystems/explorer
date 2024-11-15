'use client';

import { defineRecipe } from '@chakra-ui/react';

// export const buttonTheme = defineStyleConfig({
//   variants: {
//     primary: defineStyle(props => ({
//       fontWeight: 'semibold',
//       fontSize: 'sm',
//       color: mode(`white`, `black`)(props),
//       bgColor: mode(`purple.600`, `purple.400`)(props),
//       _hover: {
//         bgColor: mode(`purple.700`, `purple.500`)(props),
//       },
//     })),
//     secondary: defineStyle(props => ({
//       height: 12,
//       fontWeight: 'medium',
//       fontSize: 'sm',
//       color: mode(`slate.900`, `slate.50`)(props),
//       border: '1px',
//       bgColor: mode(`white`, `black`)(props),
//       _hover: {
//         bgColor: mode(`slate.200`, `slate.900`)(props),
//       },
//     })),
//     text: defineStyle(props => ({
//       padding: '0 !important',
//       border: 'none',
//       background: 'none',
//       fontWeight: 'medium',
//       fontSize: 'sm',
//       color: 'buttonText',
//       height: 'auto',
//       _hover: {
//         textDecoration: 'underline',
//       },
//     })),
//   },
// });

export const buttonRecipe = defineRecipe({
  base: {
    padding: '0 !important',
    border: 'none',
    background: 'none',
    fontWeight: 'medium',
    fontSize: 'sm',
    color: 'buttonText',
    height: 'auto',
    _hover: {
      textDecoration: 'underline',
    },
  },
  variants: {
    visual: {
      primary: {
        fontWeight: 'semibold',
        fontSize: 'sm',
        color: { base: 'white', _dark: 'black' },
        bgColor: { base: 'purple.600', _dark: 'purple.400' },
        _hover: {
          bgColor: { base: 'purple.700', _dark: 'purple.500' },
        },
      },
      secondary: {
        height: 12,
        fontWeight: 'medium',
        fontSize: 'sm',
        color: { base: 'slate.900', _dark: 'slate.50' },
        border: '1px',
        bgColor: { base: 'white', _dark: 'black' },
        _hover: {
          bgColor: { base: 'slate.200', _dark: 'slate.900' },
        },
      },
    },
  },
  defaultVariants: {
    visual: 'primary',
  },
});
