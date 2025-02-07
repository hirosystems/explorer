import { defineRecipe } from '@chakra-ui/react';

export const textareaRecipe = defineRecipe({
  className: 'chakra-textarea',
  base: {},
  variants: {
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

    variant: {
      primary: {
        bg: 'surfaceTertiary',
        borderColor: 'borderPrimary',
        borderRadius: 'redesign.md',
        borderWidth: '1px',
        color: 'textPrimary',
        _selection: {
          bg: 'surfaceFourth',
        },
        _hover: {
          '& .checkbox__label': { color: 'white' },
        },
        _focus: {
          outline: 'none',
        },
        _focusVisible: {
          borderColor: {
            base: '{colors.accent.stacks-200} !important',
            _dark: '{colors.accent.stacks-700} !important',
          },
          borderWidth: '2px !important',
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
  },
  defaultVariants: {},
});
