'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

// const multiStyleConfigHelpers = createMultiStyleConfigHelpers(tabsAnatomy.keys);

// const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
//   root: {
//     minWidth: 0,
//   },
//   tabpanel: {},
//   tablist: {
//     py: '6',
//     borderBottom: '1px',
//     borderColor: mode(`slate.150`, `slate.900`)(props),
//   },
//   tab: {
//     color: 'slate.700',
//     borderRadius: 'lg',
//     fontSize: 'sm',
//     _selected: {
//       bg: mode(`slate.150`, `slate.900`)(props),
//       color: mode(`slate.900`, `slate.50`)(props),
//     },
//   },
// }));

// export const tabTheme = multiStyleConfigHelpers.defineMultiStyleConfig({
//   variants: {
//     'soft-rounded': baseStyle,
//   },
// });

export const tabsSlotRecipe = defineSlotRecipe({
  className: 'tab',
  slots: ['root', 'list', 'trigger', 'content'],
  base: {
    root: {
      minWidth: 0,
    },
    list: {
      py: 6,
    },
    content: {},
    trigger: {
      color: '{colors.slate.700}',
      borderRadius: 'lg',
      fontSize: 'md',
      fontWeight: 'semibold',
      border: 'none',
      '--indicator-color': 'transparent !important',
      _selected: {
        bg: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
        color: { base: '{colors.slate.900}', _dark: '{colors.slate.50}' },
      },
    },
  },
  variants: {
    variant: {
      primary: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
