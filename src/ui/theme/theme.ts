'use client';

import { StyleFunctionProps, extendTheme } from '@chakra-ui/react';

import { CI_DEFAULT_BREAKPOINTS } from './breakpoints';
import { COLORS, NEW_COLORS } from './colors';
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

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
    cssVarPrefix: 'stacks',
  },
  colors: { ...COLORS, ...NEW_COLORS },
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
  shadows: {
    elevation1: {
      default: '0 2px 6px rgba(183, 180, 176, 0.2)',
      _dark: '0 2px 6px rgba(0, 0, 0, 0.2)',
    },
    elevation2: {
      default: '0 8px 16px rgba(183, 180, 176, 0.2)',
      _dark: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    elevation3: {
      default: '0 16px 32px rgba(183, 180, 176, 0.2)',
      _dark: '0 16px 32px rgba(0, 0, 0, 0.2)',
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
  space: {
    0: '0px',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    4.5: '1.125rem',
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    18: '4.5rem', // 72px
  },
  borders: {
    '1px': '1px solid var(--stacks-colors-borderPrimary)',
    dark_1px: '1px solid var(--stacks-colors-borderSecondary)',
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
    Link: linkTheme,
  },
  breakpoints: {
    ...CI_DEFAULT_BREAKPOINTS,
    // ...NEW_BREAKPOINTS
  },
});
