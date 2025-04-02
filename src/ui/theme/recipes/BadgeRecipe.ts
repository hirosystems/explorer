'use client';

import { defineRecipe } from '@chakra-ui/react';

export const badgeRecipe = defineRecipe({
  base: {
    borderRadius: 'redesign.md',
  },
  variants: {
    variant: {
      solid: {
        bg: 'surfacePrimary',
      },
      outline: {
        bg: 'surfaceSecondary',
        border: '1px solid',
        borderColor: 'redesignBorderSecondary',
      },
    },
    content: {
      iconAndLabel: {
        pl: 1,
        pr: 1.5,
        py: 1,
      },
      iconOnly: {
        p: 1,
      },
    },
    size: {},
  },
});
