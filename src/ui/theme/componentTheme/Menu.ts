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
      bg: 'dropdownBgHover',
    },
    _active: {
      bg: 'dropdownBgHover',
    },
  },
  // this will style the MenuList component
  list: {
    border: 'border',
    bg: 'bg',
  },
  // this will style the MenuItem and MenuItemOption components
  item: {
    padding: '2 3',
    borderRadius: '10px',
    color: 'text',
    bg: 'bg',
    _hover: {
      bg: 'dropdownBgHover',
    },
    _active: {
      bg: 'dropdownBgHover',
    },
  },
}));

export const menuTheme = defineMultiStyleConfig({ baseStyle });
