'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

export const tabsSlotRecipe = defineSlotRecipe({
  className: 'tab',
  slots: ['root', 'list', 'trigger', 'content'],
  base: {
    root: {
      minWidth: 0,
    },
    list: {
      py: 6,
    },
    content: {},
    trigger: {
      color: '{colors.slate.700}',
      borderRadius: 'lg',
      fontSize: 'md',
      fontWeight: 'semibold',
      border: 'none',
      '--indicator-color': 'transparent !important',
      _selected: {
        bg: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
        color: { base: '{colors.slate.900}', _dark: '{colors.slate.50}' },
      },
    },
  },
  variants: {
    variant: {
      primary: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
