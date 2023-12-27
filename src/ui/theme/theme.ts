'use client';

import { StyleFunctionProps, extendTheme } from '@chakra-ui/react';

import { COLORS } from './colors';
import { badgeTheme } from './componentTheme/Badge';
import { buttonTheme } from './componentTheme/Button';
import { checkboxTheme } from './componentTheme/Checkbox';
import { inputTheme } from './componentTheme/Input';
import { switchTheme } from './componentTheme/Switch';
import { tabTheme } from './componentTheme/Tab';
import { tagTheme } from './componentTheme/Tag';
import { inter, openSauce } from './fonts';

// const colors = {
//   accent: { light: '#5546FF', dark: '#7F80FF' },
//   brand: { light: '#5546FF', dark: '#8F91FF' },
//   bg: { light: '#fff', dark: '#040404' },
//   bg2: { light: '#fff', dark: '#0A0A0A' },
//   bg3: { light: '#fff', dark: '#141416' },
//   bg4: { light: '#F7F7FA', dark: '#1E1E20' },
//   block: { light: '#f0f0f0', dark: '#202023' },
//   lightBlock: { light: '#fff', dark: '#35353a' },
//   bgAlt: { light: '#F7F7FA', dark: '#1E1E20' },
//   bgLight: { light: '#fff', dark: '#1E1E20' },
//   invert: { light: '#040404', dark: '#ffffff' },
//   textHover: { light: '#5546FF', dark: '#7F80FF' },
//   textTitle: { light: '#141416', dark: '#ffffff' },
//   midnight: '#040404',
//   textCaption: { light: '#747478', dark: '#9C9CA2' },
//   textBody: { light: '#424248', dark: '#F7F7FA' },
//   icon: { light: '#9C9CA2', dark: '#9C9CA2' },
//   inputPlaceholder: { light: '#747478', dark: '#9C9CA2' },
//   border: { light: '#F0F0F2', dark: '#202020' },
//   feedbackAlert: { light: '#FE9000', dark: '#FFB44D' },
//   feedbackError: { light: '#CF0000', dark: '#F34D4D' },
//   feedbackSuccess: { light: '#00A200', dark: '#49CE49' },
//   textInvert: { light: '#fff', dark: '#040404' },
//   links: { light: '#47409c', dark: '#8F91FF' },
//   switchBg: { light: '#cbd5e0', dark: '#cbd5e0' },
// };

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
        _dark: 'slate.900',
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
  },
});
