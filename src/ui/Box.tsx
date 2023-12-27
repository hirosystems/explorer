'use client';

import { Box as CUIBox, BoxProps as CUIBoxProps, forwardRef, useColorMode } from '@chakra-ui/react';

import { UIComponent } from './types';

export type BoxProps = CUIBoxProps & UIComponent;
export const Box = forwardRef<BoxProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIBox
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIBox>
));
