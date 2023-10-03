import { useColorMode } from '@chakra-ui/react';
import { css } from '@emotion/css';

export const useVerticallyStackedElementsBorderStyle = () => css`
  > * {
    border-bottom: 1px solid var(--stacks-colors-border-${useColorMode().colorMode});
    &:last-child {
      border-bottom: none;
    }
  }
`;
