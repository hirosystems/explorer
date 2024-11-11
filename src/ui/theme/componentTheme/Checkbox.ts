'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

// const multiStyleConfigHelpers = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

// export const checkboxTheme = multiStyleConfigHelpers.defineMultiStyleConfig({
//   sizes: {},
//   variants: {
//     outline: multiStyleConfigHelpers.definePartsStyle(props => ({
//       control: {
//         bg: 'surface',
//         borderColor: mode(`slate.300`, `slate.700`)(props),
//         _checked: {
//           bg: mode(`purple.600`, `purple.400`)(props),
//           borderColor: mode(`purple.600`, `purple.400`)(props),
//           _hover: {
//             bg: mode(`purple.600`, `purple.400`)(props),
//             borderColor: mode(`purple.600`, `purple.400`)(props),
//           },
//         },
//         _hover: {
//           bg: 'surface',
//           borderColor: mode(`slate.300`, `slate.700`)(props),
//         },
//       },
//       label: {
//         fontSize: 'sm',
//       },
//     })),
//   },
// });

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ['root', 'control', 'label'], 
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
          label: {
            fontSize: 'sm',
          },
        },
      },
    },
  },
});
