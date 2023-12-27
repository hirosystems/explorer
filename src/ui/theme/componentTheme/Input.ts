import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const multiStyleConfigHelpers = createMultiStyleConfigHelpers(inputAnatomy.keys);

export const inputTheme = multiStyleConfigHelpers.defineMultiStyleConfig({
  sizes: {},
  variants: {
    outline: multiStyleConfigHelpers.definePartsStyle(props => ({
      field: {
        fontSize: 'sm',
        borderColor: 'border',
        _placeholder: {
          color: mode(`slate.600`, `slate.500`)(props),
        },
      },
    })),
  },
});
