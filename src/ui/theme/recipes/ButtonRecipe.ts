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
  base: {},
  variants: {
    variant: {
      primary: {
        fontWeight: 'semibold',
        fontSize: 'lg',
        color: { base: '{colors.neutral.white}', _dark: '{colors.neutral.black}' },
        bg: { base: '{colors.purple.600}', _dark: '{colors.purple.400}' },
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
          bg: { base: '{colors.purple.700}', _dark: '{colors.purple.500}' },
        },
      },
      secondary: {
        height: 12,
        fontWeight: 'medium',
        fontSize: 'sm',
        color: { base: '{colors.neutral.black}', _dark: '{colors.neutral.white}' },
        border: '1px solid {colors.borderSecondary}',
        bg: { base: '{colors.neutral.white}', _dark: '{colors.neutral.black}' },
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
          bg: { base: '{colors.slate.200}', _dark: '{colors.slate.900}' },
        },
      },
      text: {
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
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
