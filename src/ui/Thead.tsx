'use client';

import {
  Thead as CUIThead,
  TableHeadProps as CUITheadProps,
  forwardRef,
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
    {...rest}
  >
    {children}
  </CUIThead>
));
