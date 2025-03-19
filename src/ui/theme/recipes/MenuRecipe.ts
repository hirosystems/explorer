'use client';

import { defineSlotRecipe } from '@chakra-ui/react';

export const menuSlotRecipe = defineSlotRecipe({
  className: 'menu',
  slots: [
    'item',
    'itemIndicator',
    'content',
    'positioner',
    'separator',
    'indicator',
    'trigger',
    'itemGroup',
    'arrow',
    'arrowTip',
    'contextTrigger',
    'itemGroupLabel',
    'itemText',
    'triggerItem',
  ],
  base: {
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      position: 'relative',
      whiteSpace: 'nowrap',
      outlineOffset: '2px',
      lineHeight: '1.2',
      borderRadius: 'md',
      fontWeight: 'semibold',
      height: 10,
      width: 'fit-content',
      fontSize: 'sm',
      paddingInlineStart: 4,
      paddingInlineEnd: 4,
      color: 'white',
      bgColor: { base: 'purple.600', _dark: 'purple.400' },
      _hover: {
        bgColor: { base: 'purple.700', _dark: 'purple.500' },
      },
    },
    content: {
      border: 'borderPrimary',
      bg: 'surface',
    },
    item: {
      padding: '2 3',
      borderRadius: '10px',
      color: 'text',
      bg: 'surface',
      _hover: {
        bg: 'hoverBackground',
      },
      _active: {
        bg: 'hoverBackground',
      },
    },
  },
  variants: {
    variant: {
      redesignPrimary: {
        trigger: {
          textStyle: 'heading-sm',
          color: 'textSecondary',
          display: 'inline-flex',
          gap: 2,
          borderRadius: 'redesign.lg',
          px: 3,
          py: 1.5,
          bgColor: 'surfacePrimary',
          justifyContent: 'space-between',
          boxShadow: 'none',
          _open: {
            boxShadow: 'elevation1',
          },
          _closed: {
            boxShadow: 'none',
          },
          _hover: {
            color: 'textPrimary',
            bgColor: 'surfacePrimary',
          },
          _active: {
            border: 'none',
            outline: 'none',
          },
          _focus: {
            border: 'none',
            outline: 'none',
          },
          _focusVisible: {
            border: 'none',
            outline: 'none',
          },
        },
        content: {
          bgColor: 'surfacePrimary',
          color: 'textSecondary',
          borderRadius: 'redesign.lg',
          boxShadow: 'none',
          _open: {
            boxShadow: 'elevation1',
          },
          _closed: {
            boxShadow: 'none',
          },
        },
        item: {
          textStyle: 'heading-sm',
          color: 'textSecondary',
          bgColor: 'transparent',
          _hover: {
            color: 'textPrimary',
            bgColor: 'transparent',
          },
        },
      },
    },
  },
});
