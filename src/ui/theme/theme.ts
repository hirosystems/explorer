'use client';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import { BORDER_RADIUS } from './borderRadius';
import { BORDERS } from './borders';
import { BREAKPOINTS } from './breakpoints';
import { COLORS, NEW_COLORS } from './colors';
import { buttonRecipe } from './componentTheme/Button';
import { checkboxSlotRecipe } from './componentTheme/Checkbox';
import { inputSlotRecipe } from './componentTheme/Input';
import { linkRecipe } from './componentTheme/Link';
import { menuSlotRecipe } from './componentTheme/Menu';
import { switchSlotRecipe } from './componentTheme/Switch';
import { tabSlotRecipe } from './componentTheme/Tab';
import { tagSlotRecipe } from './componentTheme/Tag';
import { FONT_SIZES } from './fontSizes';
import { FONT_WEIGHTS } from './fontWeights';
import { FONTS } from './fonts';
import { LETTER_SPACINGS } from './letterSpacings';
import { LINEHEIGHTS } from './lineHeights';
import { SEMANTIC_TOKENS } from './semanticTokens';
import { SHADOWS } from './shadows';
import { SIZES } from './sizes';
import { SPACE } from './space';
import { Z_INDEX } from './zIndex';

const explorerConfig = defineConfig({
  cssVarsPrefix: 'stacks',
  // useSystemColorMode: false,
  // initialColorMode: 'light',
});

export const system = createSystem(defaultConfig, explorerConfig, {
  theme: {
    recipes: {
      button: buttonRecipe,
      link: linkRecipe,
    },
    slotRecipes: {
      checkbox: checkboxSlotRecipe,
      input: inputSlotRecipe,
      menu: menuSlotRecipe,
      switch: switchSlotRecipe,
      tab: tabSlotRecipe,
      tag: tagSlotRecipe,
    },
    tokens: {
      colors: { ...COLORS, ...NEW_COLORS },
      shadows: {
        ...SHADOWS,
      },
      letterSpacings: {
        ...LETTER_SPACINGS,
      },
      lineHeights: {
        ...LINEHEIGHTS,
      },
      zIndex: {
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
      spacing: {
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
      // textStyles: {
      //   ...TEXT_STYLES,
      // },
    },
    semanticTokens: {
      ...SEMANTIC_TOKENS,
    },
  },
});
