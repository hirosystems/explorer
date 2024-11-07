'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

export const tagSlotRecipe = defineSlotRecipe({
  className: 'chakra-tag',
  slots: ['label', 'root', 'closeTrigger', 'startElement', 'endElement'],
  base: {},
  variants: {
    variant: {
      primary: {
        label: {
          fontSize: 'xs',
        },
        root: {
          rounded: 'full',
          bg: 'whiteAlpha.400',
          color: 'white',
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'nowrap',
          px: 2,
          py: 1,
        },
        startElement: {
          alignItems: 'center',
          display: 'flex',
          h: 3.5,
          w: 3.5,
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
