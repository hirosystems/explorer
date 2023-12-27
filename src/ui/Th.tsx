'use client';

import {
  Th as CUITh,
  TableColumnHeaderProps as CUIThProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type ThProps = CUIThProps & UIComponent;
export const Th = forwardRef<ThProps, 'th'>(({ children, size, ...rest }, ref) => (
  <CUITh
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITh>
));
