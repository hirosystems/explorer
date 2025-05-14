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
        textDecoration: 'underline',
        textDecorationColor: 'var(--stacks-colors-redesign-border-secondary)',
        _hover: {
          textDecoration: 'underline',
        },
      },
      tableLink: {
        textDecoration: 'underline',
        _hover: {
          color: 'textInteractiveHover',
        },
      },
      buttonLink: {
        p: '0',
        pb: '0.5',
        textDecoration: 'none !important',
        // textDecoration: 'none',

        fontFamily: 'var(--font-instrument-sans)',
        color: 'textPrimary',
        borderBottom: '2px solid',
        borderColor: 'redesignBorderSecondary',
        _hover: {
          textDecoration: 'none',
          borderBottomColor: 'redesignBorderPrimary',
        },
        _disabled: {
          textDecoration: 'none',
          color: 'textTertiary',
        },
      },
    },
    size: {
      sm: {},
      lg: {},
    },
  },
  // temporarily using the `compoundVariants` to avoid overriding base styles for old design
  compoundVariants: [
    {
      variant: 'buttonLink',
      size: 'sm',
      css: {
        textStyle: 'text-medium-xs',
        lineHeight: 'snug',
      },
    },
    {
      variant: 'buttonLink',
      size: 'lg',
      css: {
        textStyle: 'text-medium-sm',
        lineHeight: 'taller',
      },
    },
  ],
  defaultVariants: {
    variant: 'underline',
  },
});
