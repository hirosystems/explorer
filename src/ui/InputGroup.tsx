'use client';

import {
  InputGroup as CUIInputGroup,
  InputGroupProps as CUIInputGroupProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type InputGroupProps = CUIInputGroupProps & UIComponent;
export const InputGroup = forwardRef<InputGroupProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIInputGroup
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIInputGroup>
));
