import { defineSlotRecipe } from '@chakra-ui/react';

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
            color: { base: '{colors.slate.600}', _dark: '{colors.slate.500}' },
          },
        },
      },
    },
  },
});
