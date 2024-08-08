'use client';

import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, theme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  menuAnatomy.keys
);

console.log('theme', theme.components.Button.baseStyle);
const baseStyle = definePartsStyle(props => ({
  // this will style the MenuButton component
  button: {
    type: 'button',
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
    bgColor: mode(`purple.600`, `purple.400`)(props),
    _hover: {
      bgColor: mode(`purple.700`, `purple.500`)(props),
    },
    // Use the Button base style
    // bg: 'surface',
    // fontWeight: 'semibold',
    // fontSize: 'sm',
    // border: '1px',
    // borderColor: 'borderPrimary',

    // _hover: {
    //   bg: 'hoverBackground',
    // },
    // _active: {
    //   bg: 'hoverBackground',
    // },
  },
  // this will style the MenuList component
  list: {
    border: 'borderPrimary',
    bg: 'surface',
  },
  // this will style the MenuItem and MenuItemOption components
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
}));

export const menuTheme = defineMultiStyleConfig({ baseStyle });
