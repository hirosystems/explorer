'use client';

import { defineRecipe } from '@chakra-ui/react';

export const linkRecipe = defineRecipe({
  className: 'link',
  base: {
    _focus: {
      outlineWidth: 'none',
      outlineOffset: 'none',
      outlineStyle: 'none',
      outlineColor: 'transparent',
    },
  },
  variants: {
    variant: {
      aTag: {
        textDecoration: 'underline',
        color: 'purple.600',
        _hover: {
          textDecoration: 'none',
        },
      },
      noUnderline: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
        },
      },
      underline: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
});
