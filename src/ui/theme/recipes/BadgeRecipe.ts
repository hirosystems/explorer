'use client';

import { defineRecipe } from '@chakra-ui/react';

export const badgeRecipe = defineRecipe({
  base: {
    borderRadius: 'redesign.md',
  },
  variants: {
    variant: {
      solid: {
        bg: 'surfacePrimary',
      },
      outline: {
        bg: 'surfaceSecondary',
        border: '1px solid',
        borderColor: 'redesignBorderSecondary',
      },
    },
    content: {
      iconAndLabel: {
        pl: 1,
        pr: 1.5,
        py: 1,
      },
      iconOnly: {
        py: 1,
        px: 1.5,
      },
    },
    type: {
      tag: {
        fontFamily: 'matterMono',
        px: 2,
        py: 1.5,
      },
      transactionType: {
        fontFamily: 'instrumentSans',
        pl: 1,
        pr: 1.5,
        py: 1,
      },
      transactionStatus: {
        fontFamily: 'instrumentSans',
        px: 1.5,
        py: 1,
      },
      blockHeight: {
        fontFamily: 'matterMono',
        px: 1.5,
        py: 1,
      },
    },
    size: {},
  },
  compoundVariants: [
    {
      content: 'iconOnly',
      type: 'transactionType',
      css: {
        p: 1,
      },
    },
    {
      content: 'iconOnly',
      type: 'transactionStatus',
      css: {
        py: 1,
        px: 1.5,
      },
    },
  ],
});
