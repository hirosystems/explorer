'use client';

import { checkboxAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@chakra-ui/react';

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: [...checkboxAnatomy.keys()],
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
          color: 'iconInvert',
          borderColor: 'redesignBorderPrimary',
          bg: 'surfaceTertiary',
          borderRadius: 'redesign.xs',
          _focus: {
            outline: 'none',
            boxShadow: {
              base: '0 0 0 2px var(--stacks-colors-accent-stacks-300)',
              _dark: '0 0 0 2px var(--stacks-colors-accent-stacks-600)',
            },
          },
          _checked: {
            bg: 'surfaceInvert',
            borderColor: 'surfaceInvert',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
