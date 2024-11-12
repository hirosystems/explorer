'use client';

import { Box as CUIBox, BoxProps as CUIBoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type BoxProps = CUIBoxProps & UIComponent;
export const Box = forwardRef<HTMLDivElement, BoxProps>(({ children, size, ...rest }, ref) => (
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
