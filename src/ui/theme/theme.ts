'use client';

import { createSystem, defaultConfig } from '@chakra-ui/react';

import { BORDER_RADIUS } from './borderRadius';
import { BORDERS } from './borders';
import { BREAKPOINTS } from './breakpoints';
import { COLORS, NEW_COLORS } from './colors';
import { badgeTheme } from './componentTheme/Badge';
import { buttonRecipe, buttonTheme } from './componentTheme/Button';
import { checkboxTheme } from './componentTheme/Checkbox';
import { inputTheme } from './componentTheme/Input';
import { linkTheme } from './componentTheme/Link';
import { menuTheme } from './componentTheme/Menu';
import { switchTheme } from './componentTheme/Switch';
import { tabTheme } from './componentTheme/Tab';
import { tagTheme } from './componentTheme/Tag';
import { FONT_SIZES } from './fontSizes';
import { FONT_WEIGHTS } from './fontWeights';
import { FONTS } from './fonts';
import { LETTER_SPACINGS } from './letterSpacings';
import { LINEHEIGHTS } from './lineHeights';
import { SEMANTIC_TOKENS } from './semanticTokens';
import { SHADOWS } from './shadows';
import { SIZES } from './sizes';
import { SPACE } from './space';
import { TEXT_STYLES } from './textStyles';
import { Z_INDEX } from './zIndex';

export const system = createSystem(defaultConfig, {
  theme: {
    useSystemColorMode: false,
    initialColorMode: 'light',
    cssVarPrefix: 'stacks',
    recipes: {
      button: buttonRecipe,
    },
    tokens: {
      // components: {
      //   Switch: switchTheme,
      //   Checkbox: checkboxTheme,
      //   Tabs: tabTheme,
      //   Badge: badgeTheme,
      //   Tag: tagTheme,
      //   Input: inputTheme,
      //   Button: buttonTheme,
      //   Menu: menuTheme,
      //   Link: linkTheme,
      // },
      colors: { ...COLORS, ...NEW_COLORS },
      semanticTokens: {
        ...SEMANTIC_TOKENS,
      },
      shadows: {
        ...SHADOWS,
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
        ...FONTS,
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
        ...BORDERS,
      },
      radii: {
        ...BORDER_RADIUS,
      },
      breakpoints: {
        ...BREAKPOINTS,
      },
      textStyles: {
        ...TEXT_STYLES, // TODO: FIX?
      },
    },
  },
});
