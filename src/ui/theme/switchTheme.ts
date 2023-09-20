import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const multiStyleConfigHelpers = createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = multiStyleConfigHelpers.definePartsStyle(props => ({
  thumb: {
    bg: mode(`#fff`, `bg4.dark`)(props),
  },
  track: {
    bg: mode(`switchBg.light`, `switchBg.dark`)(props),
    _checked: {
      bg: mode(`brand.light`, `brand.dark`)(props),
    },
  },
}));

export const switchTheme = multiStyleConfigHelpers.defineMultiStyleConfig({ baseStyle });
