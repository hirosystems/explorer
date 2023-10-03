import {
  forwardRef,
  Grid as CUIGrid,
  GridProps as CUIGridProps,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type GridProps = CUIGridProps & UIComponent;
export const Grid = forwardRef<GridProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIGrid
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    borderColor={`border.${useColorMode().colorMode}`}
    {...rest}
  >
    {children}
  </CUIGrid>
));
