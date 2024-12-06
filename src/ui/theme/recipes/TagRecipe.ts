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
        },
        startElement: {
          alignItems: 'center',
          display: 'flex',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
