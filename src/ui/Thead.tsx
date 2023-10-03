import {
  forwardRef,
  TableHeadProps as CUITheadProps,
  Thead as CUIThead,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TheadProps = CUITheadProps & UIComponent;
export const Thead = forwardRef<TheadProps, 'thead'>(({ children, size, ...rest }, ref) => (
  <CUIThead
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    borderColor={`border.${useColorMode().colorMode}`}
    {...rest}
  >
    {children}
  </CUIThead>
));
