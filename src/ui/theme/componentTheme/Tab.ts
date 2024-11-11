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

export const tabSlotRecipe = defineSlotRecipe({
  className: 'tab',
  slots: ['root', 'tabpanel', 'tablist', 'tab'],
  base: {
    root: {
      minWidth: 0,
    },
    tabpanel: {},
    tablist: {
      py: '6',
      borderBottom: '1px',
      borderColor: { base: 'slate.150', _dark: 'slate.900' },
    },
    tab: {
      color: 'slate.700',
      borderRadius: 'lg',
      fontSize: 'sm',
      _selected: {
        bg: { base: 'slate.150', _dark: 'slate.900' },
        color: { base: 'slate.900', _dark: 'slate.50' },
      },
    },
  },
});
