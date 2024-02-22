'use client';

import { StyleFunctionProps, extendTheme } from '@chakra-ui/react';

import { COLORS } from './colors';
import { badgeTheme } from './componentTheme/Badge';
import { buttonTheme } from './componentTheme/Button';
import { checkboxTheme } from './componentTheme/Checkbox';
import { inputTheme } from './componentTheme/Input';
import { menuTheme } from './componentTheme/Menu';
import { switchTheme } from './componentTheme/Switch';
import { tabTheme } from './componentTheme/Tab';
import { tagTheme } from './componentTheme/Tag';
import { inter, openSauce } from './fonts';

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
    cssVarPrefix: 'stacks',
  },
  colors: COLORS,
  semanticTokens: {
    colors: {
      brand: 'purple.600',
      border: {
        default: 'slate.150',
        _dark: 'slate.850',
      },
      borderDark: {
        default: 'slate.300',
        _dark: 'slate.700',
      },
      error: 'red.600',
      bg: {
        default: 'white',
        _dark: 'black',
      },
      dropdownBgHover: {
        default: 'slate.150',
        _dark: 'slate.850',
      },
      invert: {
        default: 'black',
        _dark: 'white',
      },
      text: {
        default: 'slate.900',
        _dark: 'slate.50',
      },
      secondaryText: {
        default: 'slate.700',
        _dark: 'slate.600',
      },
      buttonHoverBg: {
        default: 'slate.100',
        _dark: 'slate.900',
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {},
    }),
  },
  lineHeights: {
    base: 1.15,
  },
  zIndices: {
    tooltip: 10000,
  },
  fonts: {
    body: inter.style.fontFamily,
    heading: openSauce.style.fontFamily,
  },
  fontWeights: {
    medium: 500,
  },
  sizes: {
    4.5: '1.125rem',
  },
  borders: {
    '1px': '1px solid var(--stacks-colors-border)',
    dark_1px: '1px solid var(--stacks-colors-borderDark)',
  },
  components: {
    Switch: switchTheme,
    Checkbox: checkboxTheme,
    Tabs: tabTheme,
    Badge: badgeTheme,
    Tag: tagTheme,
    Input: inputTheme,
    Button: buttonTheme,
    Menu: menuTheme,
  },
});
