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
      redesignPrimary: {
        content: {
          fontSize: 'xs',
          fontWeight: 'medium',
          color: '{colors.neutral.sand-50}',
          bg: '{colors.neutral.sand-600} !important',
          borderColor: '{colors.neutral.sand-600} !important',
          boxShadow: '{shadows.elevation1} !important',
        },
        arrow: {
          bg: 'transparent',
          borderColor: 'transparent',
        },
        arrowTip: {
          bg: '{colors.neutral.sand-600} !important',
          borderColor: '{colors.neutral.sand-600} !important',
        },
      },
    },
    size: {
      sm: {
        content: {
          py: 1.5,
          px: 2,
        },
      },
      lg: {
        content: {
          py: 2,
          px: 3,
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
});
