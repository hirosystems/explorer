'use client';

import { Select as CUISelect, SelectProps as CUISelectProps, forwardRef } from '@chakra-ui/react';

import { UIComponent } from './types';

export type SelectProps = CUISelectProps & UIComponent;
export const Select = forwardRef<SelectProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUISelect
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUISelect>
));
