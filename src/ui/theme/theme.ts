'use client';

import { StyleFunctionProps, extendTheme } from '@chakra-ui/react';

import { BORDER_RADIUS } from './borderRadius';
import { BREAKPOINTS } from './breakpoints';
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
import { FONT_SIZES } from './fontSizes';
import { FONT_WEIGHTS } from './fontWeights';
import { instrumentSans, inter, matterMonoRegular, matterRegular, openSauce } from './fonts';
import { LETTER_SPACINGS } from './letterSpacings';
import { LINEHEIGHTS } from './lineHeights';
import { SIZES } from './sizes';
import { SPACE } from './space';
import { TEXT_STYLES } from './textStyles';
import { Z_INDEX } from './zIndex';

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
  letterSpacings: {
    ...LETTER_SPACINGS,
  },
  lineHeights: {
    ...LINEHEIGHTS,
  },
  zIndices: {
    ...Z_INDEX,
  },
  fonts: {
    body: inter.style.fontFamily,
    heading: openSauce.style.fontFamily,
    matter: matterRegular.style.fontFamily,
    matterMono: matterMonoRegular.style.fontFamily,
    instrument: instrumentSans.style.fontFamily,
  },
  fontSizes: {
    ...FONT_SIZES,
  },
  fontWeights: {
    ...FONT_WEIGHTS,
  },
  sizes: {
    ...SIZES,
  },
  space: {
    ...SPACE,
  },
  borders: {
    '1px': '1px solid var(--stacks-colors-borderPrimary)',
    dark_1px: '1px solid var(--stacks-colors-borderSecondary)',
  },
  radii: {
    ...BORDER_RADIUS,
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
    ...BREAKPOINTS,
  },
  textStyles: {
    ...TEXT_STYLES,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {},
    }),
  },
});
