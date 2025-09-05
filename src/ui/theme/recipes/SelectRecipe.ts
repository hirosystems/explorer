import { selectAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@chakra-ui/react';

export const selectSlotRecipe = defineSlotRecipe({
  className: 'chakra-select',
  slots: selectAnatomy.keys(),
  base: {
    root: {
      minWidth: 'fit-content',
      maxWidth: 'fit-content',
    },
    control: {
      border: 'none',
      borderRadius: 'redesign.lg',
      bg: 'surfacePrimary',
      minWidth: 'fit-content',
      maxWidth: 'fit-content',
    },

    trigger: {
      border: 'none',
      borderRadius: 'redesign.lg',
      bg: 'surfacePrimary',
      py: 1,
      px: 3,
    },

    valueText: {
      fontFamily: 'instrument',
      textStyle: 'text-medium-sm',
      color: 'textSecondary',
      minWidth: 'fit-content',
      maxWidth: 'fit-content',
    },

    content: {
      bg: 'surfacePrimary',
      p: 0,
      py: 3,
      px: 3,
      boxShadow: 'elevation2',
      minWidth: 'fit-content',
    },

    item: {
      textStyle: 'text-medium-sm',
      color: 'textSecondary',
      p: 0,
      px: 0,
      py: 0,
      paddingInline: 0,
      paddingBlock: 0,
      whiteSpace: 'nowrap',
      bg: 'surfacePrimary',
      _hover: {
        bg: 'surfacePrimary',
        color: 'textPrimary',
      },
    },
  },

  variants: {
    variant: {},

    size: {
      xs: {
        root: {},
        trigger: {},
        itemText: {},
      },
      sm: {
        root: {},
        trigger: {
          fontSize: 'xs',
        },
        itemText: {
          fontSize: 'xs',
        },
      },
      md: {
        root: {},
        trigger: {
          fontSize: 'sm',
        },
        itemText: {
          fontSize: 'sm',
        },
      },
      lg: {
        root: {},
        trigger: {
          fontSize: 'md',
        },
        itemText: {
          fontSize: 'md',
        },
      },
    },
  },

  defaultVariants: {},
});
