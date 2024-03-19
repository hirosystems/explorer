'use client';

import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  menuAnatomy.keys
);

const baseStyle = definePartsStyle(props => ({
  // this will style the MenuButton component
  button: {
    _hover: {
      bg: 'hoverBackground',
    },
    _active: {
      bg: 'hoverBackground',
    },
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
