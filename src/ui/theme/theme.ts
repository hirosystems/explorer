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
import { instrumentSans, inter, matterMonoRegular, matterRegular, openSauce } from './fonts';

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
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {},
    }),
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeights: {
    normal: 'normal', // default
    none: '1', // default
    // base: 1.15,
    tighter: '1.15', // custom
    tight: '1.2', // custom
    shorter: '1.25', // default
    snug: '1.3', // custom
    short: '1.375', // default
    medium: '1.4', // custom
    base: '1.5', // default
    tall: '1.625', // default
    taller: '2', // default
  },
  zIndices: {
    tooltip: 10000,
  },
  fonts: {
    body: inter.style.fontFamily,
    heading: openSauce.style.fontFamily,
    matter: matterRegular.style.fontFamily,
    matterMono: matterMonoRegular.style.fontFamily,
    instrument: instrumentSans.style.fontFamily,
  },
  fontSizes: {
    '2xs': '0.625rem', // 10px
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '3.5xl': '2rem', // 32px
    '4xl': '2.25rem', // 36px
    '4.5xl': '2.5rem', // 40px
    '5xl': '3rem', // 48px
    '6xl': '4rem', // 64px
    '6.5xl': '4.5rem', // 72px
    '7xl': '5rem', // 80px
  },
  fontWeights: {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
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
  textStyles: {
    // Regular Variants
    'text-regular-xs': {
      fontSize: 'xs',
      fontWeight: 'regular',
      letterSpacing: 'wide',
      lineHeight: 'compact',
    },
    'text-regular-sm': {
      fontSize: 'sm',
      fontWeight: 'regular',
      letterSpacing: 'normal',
      lineHeight: 'comfortable',
    },
    'text-regular-md': {
      fontSize: 'md',
      fontWeight: 'regular',
      letterSpacing: 'normal',
      lineHeight: 'compact',
    },
    'text-regular-lg': {
      fontSize: 'lg',
      fontWeight: 'regular',
      letterSpacing: 'normal',
      lineHeight: 'comfortable',
    },
    'text-regular-xl': {
      fontSize: 'xl',
      fontWeight: 'regular',
      letterSpacing: 'normal',
      lineHeight: 'comfortable',
    },

    // Medium Variants
    'text-medium-xs': {
      fontSize: 'xs',
      fontWeight: 'medium',
      letterSpacing: 'wide',
      lineHeight: 'compact',
    },
    'text-medium-sm': {
      fontSize: 'sm',
      fontWeight: 'medium',
      letterSpacing: 'normal',
      lineHeight: 'comfortable',
    },
    'text-medium-md': {
      fontSize: 'md',
      fontWeight: 'medium',
      letterSpacing: 'normal',
      lineHeight: 'relaxed',
    },
    'text-medium-lg': {
      fontSize: 'lg',
      fontWeight: 'medium',
      letterSpacing: 'normal',
      lineHeight: 'compact',
    },
    'text-medium-xl': {
      fontSize: 'xl',
      fontWeight: 'medium',
      letterSpacing: 'normal',
      lineHeight: 'comfortable',
    },

    // Semi-bold Variants
    'text-semibold-xs': {
      fontSize: 'xs',
      fontWeight: 'semibold',
      letterSpacing: 'wide',
      lineHeight: 'compact',
    },
    'text-semibold-sm': {
      fontSize: 'sm',
      fontWeight: 'semibold',
      letterSpacing: 'normal',
      lineHeight: 'comfortable',
    },
    'text-semibold-md': {
      fontSize: 'md',
      fontWeight: 'semibold',
      letterSpacing: 'normal',
      lineHeight: 'relaxed',
    },
    'text-semibold-lg': {
      fontSize: 'lg',
      fontWeight: 'semibold',
      letterSpacing: 'normal',
      lineHeight: 'compact',
    },
    'text-semibold-xl': {
      fontSize: 'xl',
      fontWeight: 'semibold',
      letterSpacing: 'normal',
      lineHeight: 'comfortable',
    },

    // Heading Variants
    'heading-xs': {
      fontSize: 'xl',
      fontWeight: 'regular',
      letterSpacing: 'tight',
      lineHeight: 'spacious',
    },
    'heading-sm': {
      fontSize: '2xl',
      fontWeight: 'regular',
      letterSpacing: 'tight',
      lineHeight: 'base',
    },
    'heading-md': {
      fontSize: '3.5xl',
      fontWeight: 'regular',
      letterSpacing: 'tighter',
      lineHeight: 'base',
    },
    'heading-lg': {
      fontSize: '4.5xl',
      fontWeight: 'regular',
      letterSpacing: 'tighter',
    },
    'heading-xl': {
      fontSize: '5xl',
      fontWeight: 'regular',
      letterSpacing: 'tighter',
    },
    'heading-2xl': {
      fontSize: '6xl',
      fontWeight: 'regular',
      letterSpacing: 'tighter',
    },
    'heading-3xl': {
      fontSize: '6.5xl',
      fontWeight: 'regular',
      letterSpacing: 'tighter',
    },
  },
});
