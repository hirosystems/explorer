'use client';

import { Input as CUIInput, InputProps as CUIInputProps, forwardRef } from '@chakra-ui/react';

export type InputProps = CUIInputProps;
export const Input = forwardRef<InputProps, 'input'>(({ children, ...rest }, ref) => (
  <CUIInput ref={ref} {...rest}>
    {children}
  </CUIInput>
));
