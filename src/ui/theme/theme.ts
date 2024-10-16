'use client';

import { StyleFunctionProps, extendTheme } from '@chakra-ui/react';

import { COLORS } from './colors';
import { badgeTheme } from './componentTheme/Badge';
import { buttonTheme } from './componentTheme/Button';
import { checkboxTheme } from './componentTheme/Checkbox';
import { inputTheme } from './componentTheme/Input';
import { linkTheme } from './componentTheme/Link';
import { menuTheme } from './componentTheme/Menu';
import { switchTheme } from './componentTheme/Switch';
import { tabTheme } from './componentTheme/Tab';
import { tagTheme } from './componentTheme/Tag';
import { inter, openSauce } from './fonts';

const borderRadius = {
  xxs: '2px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
};
export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
    cssVarPrefix: 'stacks',
  },
  colors: COLORS,
  semanticTokens: {
    colors: {
      brand: '#FC6432',
      borderPrimary: {
        default: 'slate.250',
        _dark: 'slate.850',
      },
      borderSecondary: {
        default: 'slate.150',
        _dark: 'slate.900',
      },
      error: {
        default: 'red.600',
        _dark: 'red.500',
      },
      success: {
        default: 'green.600',
        _dark: 'green.500',
      },
      surface: {
        default: 'white',
        _dark: 'black',
      },
      surfaceHighlight: {
        default: 'slate.150',
        _dark: 'slate.900',
      },
      text: {
        default: 'slate.900',
        _dark: 'slate.50',
      },
      textSubdued: {
        default: 'slate.700',
        _dark: 'slate.600',
      },
      buttonText: {
        default: 'brand',
        _dark: 'purple.400',
      },
      interactive: {
        default: 'purple.600',
        _dark: 'purple.400',
      },
      hoverBackground: {
        default: 'slate.150',
        _dark: 'slate.850',
      },
      icon: {
        default: 'slate.900',
        _dark: 'slate.50',
      },
      iconSubdued: {
        default: 'slate.700',
        _dark: 'slate.600',
      },
      invert: {
        default: 'black',
        _dark: 'white',
      },
    },
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
  space: {
    4.5: '1.125rem',
  },
  borders: {
    '1px': '1px solid var(--stacks-colors-borderPrimary)',
    dark_1px: '1px solid var(--stacks-colors-borderSecondary)',
  },
  borderRadius,
  components: {
    Switch: switchTheme,
    Checkbox: checkboxTheme,
    Tabs: tabTheme,
    Badge: badgeTheme,
    Tag: tagTheme,
    Input: inputTheme,
    Button: buttonTheme,
    Menu: menuTheme,
    Link: linkTheme,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        ...Object.entries(borderRadius).reduce((acc, [key, value]) => {
          (acc as any)[`--stacks-borderRadius-${key}`] = value;
          return acc;
        }, {}),
      },
    }),
  },
});
