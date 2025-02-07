'use client';

import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  className: 'input',
  base: {},
  variants: {
    variant: {
      primary: {
        bg: 'surfaceTertiary',
        borderColor: 'borderPrimary',
        borderRadius: 'redesign.md',
        color: 'textPrimary',
        _hover: {
          '& .checkbox__label': { color: 'white' },
        },
        _focus: {
          outline: 'none',
        },
        _focusVisible: {
          borderColor: { base: '{colors.accent.stacks-200}', _dark: '{colors.accent.stacks-700}' },
          borderWidth: '2px',
        },
        _disabled: {
          bg: 'surfaceSecondary',
          borderColor: 'borderSecondary',
          color: 'textTertiary',
        },
        _placeholder: {
          color: 'textSecondary',
        },
        _invalid: {
          borderColor: 'feedback.red-500',
          borderWidth: '2px',
        },
      },
      redesignPrimary: {
        bg: 'surfaceTertiary',
        borderColor: 'borderPrimary',
        borderRadius: 'redesign.md',
        borderWidth: '1px',
        color: 'textPrimary',
        _hover: {
          '& .checkbox__label': { color: 'white' },
        },
        _focus: {
          outline: 'none',
        },
        _focusVisible: {
          borderColor: { base: '{colors.accent.stacks-200}', _dark: '{colors.accent.stacks-700}' },
          borderWidth: '2px',
        },
        _disabled: {
          bg: 'surfaceSecondary',
          borderColor: 'borderSecondary',
          color: 'textTertiary',
        },
        _placeholder: {
          color: 'textSecondary',
        },
        _invalid: {
          borderColor: 'feedback.red-500',
          borderWidth: '2px',
        },
      },
    },
    size: {
      small: {
        fontSize: 'xs',
        '::placeholder': {
          fontSize: 'xs',
        },
      },
      big: {
        fontSize: 'sm',
        '::placeholder': {
          fontSize: 'sm',
        },
      },
    },
  },
});
