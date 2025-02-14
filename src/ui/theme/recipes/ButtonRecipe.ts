'use client';

import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {},
  variants: {
    variant: {
      primary: {
        fontWeight: 'semibold',
        fontSize: 'sm',
        color: { base: '{colors.neutral.white}', _dark: '{colors.neutral.black}' },
        bg: { base: '{colors.purple.600}', _dark: '{colors.purple.400}' },
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
          bg: { base: '{colors.purple.700}', _dark: '{colors.purple.500}' },
        },
      },
      secondary: {
        height: 12,
        fontWeight: 'medium',
        fontSize: 'sm',
        color: { base: '{colors.neutral.black}', _dark: '{colors.neutral.white}' },
        border: '1px solid {colors.borderSecondary}',
        // bg: { base: '{colors.neutral.white}', _dark: '{colors.neutral.black}' },
        bg: 'surface',
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
          bg: { base: '{colors.slate.200}', _dark: '{colors.slate.900}' },
        },
      },
      text: {
        padding: '0 !important',
        border: 'none',
        background: 'none',
        fontWeight: 'medium',
        fontSize: 'sm',
        color: 'buttonText',
        height: 'auto',
        _hover: {
          textDecoration: 'underline',
          bg: 'none',
        },
      },
      wrapper: {
        padding: '0 !important',
        border: 'none',
        background: 'none',
        h: 'fit-content',
        w: 'fit-content',
        minW: 'fit-content',
        minH: 'fit-content',
        _hover: {
          textDecoration: 'underline',
          bg: 'none',
        },
      },
      redesignPrimary: {
        borderRadius: 'redesign.md', // base
        color: {
          base: '{colors.neutral.sand-50}',
          _dark: '{colors.neutral.sand-1000}',
        },
        bg: {
          base: '{colors.neutral.sand-700}',
          _dark: '{colors.neutral.sand-50}',
        },
        _hover: {
          bg: {
            base: '{colors.neutral.sand-1000}',
            _dark: '{colors.neutral.sand-200}',
          },
        },
        _disabled: {
          color: {
            base: '{colors.neutral.sand-200}',
            _dark: '{colors.neutral.sand-300}',
          },
          bg: {
            base: '{colors.neutral.sand-400}',
            _dark: '{colors.neutral.sand-500}',
          },
        },
      },
      redesignSecondary: {
        borderRadius: 'redesign.md', // base
        color: {
          base: '{colors.neutral.sand-50}',
          _dark: '{colors.neutral.sand-1000}',
        },
        bg: {
          base: '{colors.neutral.sand-500}',
          _dark: '{colors.neutral.sand-300}',
        },
        _hover: {
          bg: {
            base: '{colors.neutral.sand-600}',
            _dark: '{colors.neutral.sand-400}',
          },
        },
        _disabled: {
          color: {
            base: '{colors.neutral.sand-100}',
            _dark: '{colors.neutral.sand-400}',
          },
          bg: {
            base: '{colors.neutral.sand-300}',
            _dark: '{colors.neutral.sand-600}',
          },
        },
      },
      redesignTertiary: {
        py: 1.5,
        px: 2,
        border: '2px solid var(--stacks-colors-redesign-border-secondary)',
        borderRadius: 'md',
        background: 'transparent',
        fontWeight: 'medium',
        fontSize: 'md',
        lineHeight: 'normal',
        color: { base: '{colors.neutral.sand-600}', _dark: '{colors.neutral.sand-150}' },
        height: 'auto',
        display: 'flex',
        alignItems: 'end',
        _hover: {
          background: { base: '{colors.neutral.sand-200}', _dark: '{colors.neutral.sand-700}' },
        },
        _disabled: {
          color: {
            base: '{colors.neutral.sand-300}',
            _dark: '{colors.neutral.sand-500}',
          },
        },
      },
      redesignWarning: {
        borderRadius: 'redesign.md', // base
        color: '{colors.neutral.sand-50}',
        bg: {
          base: '{colors.feedback.red-500}',
          _dark: '{colors.feedback.red-500}',
        },
        _hover: {
          bg: '{colors.feedback.red-600}',
        },
        _disabled: {
          color: {
            base: '{colors.neutral.sand-500}',
            _dark: '{colors.neutral.sand-300}',
          },
          bg: {
            base: '{colors.feedback.red-300}',
            _dark: '{colors.feedback.red-600}',
          },
        },
      },
    },
    size: {
      small: {
        fontSize: 'xs',
        fontWeight: 'medium',
      },
      big: {
        fontSize: 'sm',
        fontWeight: 'medium',
        py: 3,
        px: 4,
      },
    },
  },
  defaultVariants: {
    // variant: 'primary',
  },
});
