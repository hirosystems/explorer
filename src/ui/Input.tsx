'use client';

import { Input as CUIInput, InputProps as CUIInputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type InputProps = CUIInputProps;
export const Input = forwardRef<HTMLInputElement, InputProps>(({ children, ...rest }, ref) => (
  <CUIInput ref={ref} {...rest}>
    {children}
  </CUIInput>
));
