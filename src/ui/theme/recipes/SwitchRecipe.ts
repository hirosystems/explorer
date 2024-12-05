'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

export const switchSlotRecipe = defineSlotRecipe({
  slots: ['root', 'label', 'control', 'thumb', 'indicator'],
  className: 'chakra-switch',
  base: {
    root: {},
    thumb: {
      bg: { base: '{colors.neutral.white}', _dark: '{colors.neutral.black}' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transitionProperty: 'translate',
      transitionDuration: 'fast',
      borderRadius: 'inherit',
      _checked: {
        translate: 'var(--switch-x) 0',
      },
      width: 'var(--switch-height)',
      height: 'var(--switch-height)',
      scale: '0.8',
      boxShadow: 'sm',
      // _checked: {
      //   bg: 'colorPalette.contrast',
      // },
    },
    control: {},
    label: {},
  },
  variants: {
    variant: {
      // solid: { TODO: delete
      //   control: {
      //     borderRadius: 'full',
      //     bg: 'bg.emphasized',
      //     focusVisibleRing: 'outside',
      //     _checked: {
      //       bg: 'colorPalette.solid',
      //     },
      //   },
      //   thumb: {
      //     bg: 'white',
      //     width: 'var(--switch-height)',
      //     height: 'var(--switch-height)',
      //     scale: '0.8',
      //     boxShadow: 'sm',
      //     _checked: {
      //       bg: 'colorPalette.contrast',
      //     },
      //   },
      //   label: {
      //     color: 'pink',
      //   },
      // },
      // raised: {
      //   control: {
      //     borderRadius: 'full',
      //     height: 'calc(var(--switch-height) / 2)',
      //     bg: 'bg.muted',
      //     boxShadow: 'inset',
      //     _checked: {
      //       bg: 'colorPalette.solid/60',
      //     },
      //   },
      //   thumb: {
      //     width: 'var(--switch-height)',
      //     height: 'var(--switch-height)',
      //     position: 'relative',
      //     top: 'calc(var(--switch-height) * -0.25)',
      //     bg: 'white',
      //     boxShadow: 'xs',
      //     focusVisibleRing: 'outside',
      //     _checked: {
      //       bg: 'colorPalette.solid',
      //     },
      //   },
      // },
      primary: {
        root: {},
        thumb: {
          bg: { base: '{colors.neutral.white}', _dark: '{colors.neutral.black}' },
        },
        control: {
          bg: { base: '{colors.slate.200}', _dark: '{colors.slate.800}' },

          _checked: {
            bg: { base: '{colors.purple.600}', _dark: '{colors.purple.400}' },
          },
        },
        label: {},
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
