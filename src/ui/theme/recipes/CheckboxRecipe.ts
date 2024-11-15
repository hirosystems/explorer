'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ['root', 'control', 'label'], // TODO: upgrade v3. Why isn't this typed? Why isn't the checkbox anatomy exported? export { checkboxAnatomy } from "@ark-ui/react/checkbox"
  base: {},
  variants: {
    visual: {
      outline: {
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
    },
  },
});
