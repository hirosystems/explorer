'use client';

import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {},
  variants: {
    variant: {
      primary: {
        fontWeight: 'semibold',
        fontSize: 'sm',
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
        // bg: { base: '{colors.neutral.white}', _dark: '{colors.neutral.black}' },
        bg: 'surface',
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
          bg: 'none',
        },
      },
    },
  },
  defaultVariants: {
    // variant: 'primary',
  },
});
