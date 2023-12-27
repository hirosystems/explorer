'use client';

import {
  Tr as CUITr,
  TableRowProps as CUITrProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TrProps = CUITrProps & UIComponent;
export const Tr = forwardRef<TrProps, 'tr'>(({ children, size, ...rest }, ref) => (
  <CUITr
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITr>
));
