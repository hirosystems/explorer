'use client';

import { defineRecipe } from '@chakra-ui/react';

export const badgeRecipe = defineRecipe({
  base: {
    p: 1.5,
    borderRadius: 'redesign.sm',
  },
  variants: {
    variant: {
      solid: {
        bg: 'surfacePrimary',
      },
      outline: {
        bg: 'surfaceSecondary',
        border: '1px solid',
        borderColor: 'redesignBorderPrimary',
      },
    },
    size: {},
  },
});
