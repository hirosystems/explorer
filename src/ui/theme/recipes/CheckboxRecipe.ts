'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ['root', 'control', 'label', 'indicator', 'group'],
  base: {},
  variants: {
    variant: {
      primary: {
        control: {
          bg: 'surface',
          borderColor: { base: 'slate.300', _dark: 'slate.700' },
          _checked: {
            bg: { base: 'purple.600', _dark: 'purple.400' },
            borderColor: { base: 'purple.600', _dark: 'purple.400' },
            _hover: {
              bg: { base: 'purple.600', _dark: 'purple.400' },
              borderColor: { base: 'purple.600', _dark: 'purple.400' },
            },
          },
          _hover: {
            bg: 'surface',
            borderColor: { base: 'slate.300', _dark: 'slate.700' },
          },
        },
        label: {
          fontSize: 'sm',
        },
      },
      redesignPrimary: {
        control: {
          borderColor: 'borderPrimary',
          bg: 'surfaceTertiary',
          borderRadius: 'xs',
          _focus: {
            outline: 'none',
            boxShadow: '0 0 0 2px',
            boxShadowColor: {base: 'var(--stacks-colors-accent-stacks-300)', _dark: 'var(--stacks-colors-accent-stacks-600)'},
          },
          _checked: {
            bg: 'surfaceInvert',
            borderColor: 'surfaceInvert',
          },
          indicator: {
            color: 'surfaceInvert',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
