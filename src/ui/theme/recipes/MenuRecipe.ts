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
  variants: {},
});
