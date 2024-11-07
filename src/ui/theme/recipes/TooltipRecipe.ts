'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

export const tooltipSlotRecipe = defineSlotRecipe({
  slots: ['trigger', 'arrow', 'arrowTip', 'positioner', 'content'],
  base: {},
  variants: {
    variant: {
      primary: {
        content: {
          p: 2,
          borderRadius: 'md',
          bg: 'invert',
          display: 'flex',
          maxWidth: 'max-content',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
