import { defineSlotRecipe } from '@chakra-ui/react';

// const multiStyleConfigHelpers = createMultiStyleConfigHelpers(inputAnatomy.keys);

// export const inputTheme = multiStyleConfigHelpers.defineMultiStyleConfig({
//   sizes: {},
//   variants: {
//     outline: multiStyleConfigHelpers.definePartsStyle(props => ({
//       field: {
//         fontSize: 'sm',
//         borderColor: 'borderPrimary',
//         _placeholder: {
//           color: mode(`slate.600`, `slate.500`)(props),
//         },
//       },
//     })),
//   },
// });

export const inputSlotRecipe = defineSlotRecipe({
  className: 'input',
  slots: ['root', 'field'],
  base: {
    root: {
      bg: 'blue.500',
      _hover: {
        '& .checkbox__label': { color: 'white' },
      },
    },
  },
  variants: {
    visual: {
      outline: {
        field: {
          fontSize: 'sm',
          borderColor: 'borderPrimary',
          _placeholder: {
            color: { base: 'slate.600', _dark: 'slate.500' },
          },
        },
      },
    },
  },
});
