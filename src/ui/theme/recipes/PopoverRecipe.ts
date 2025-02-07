import { popoverAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@chakra-ui/react';

export const popoverSlotRecipe = defineSlotRecipe({
  slots: [...popoverAnatomy.keys()],
  className: 'stacks-popover',
  base: {},

  variants: {
    size: {},

    variant: {
      redesignPrimary: {
        positioner: {
          boxShadow: 'elevation2SansTop',
          borderRadius: 'redesign.lg',
        },
      },
    },
  },
  compoundVariants: [],
  defaultVariants: {},
});
