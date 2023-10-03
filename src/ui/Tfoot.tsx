import {
  forwardRef,
  TableFooterProps as CUITfootProps,
  Tfoot as CUITfoot,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TfootProps = CUITfootProps & UIComponent;
export const Tfoot = forwardRef<TfootProps, 'tfoot'>(({ children, size, ...rest }, ref) => (
  <CUITfoot
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    borderColor={`border.${useColorMode().colorMode}`}
    {...rest}
  >
    {children}
  </CUITfoot>
));
