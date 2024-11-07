'use client';

import { defineRecipe } from '@chakra-ui/react';

export const iconButtonRecipe = defineRecipe({
  base: {
    bg: 'transparent',
    _hover: { bg: 'rgba(255, 255, 255, 0.15)' },
    borderRadius: 'full',
  },
  variants: {
    variant: {
      primary: {
        bg: 'transparent',
        _hover: { bg: 'rgba(255, 255, 255, 0.15)' },
        borderRadius: 'full',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
