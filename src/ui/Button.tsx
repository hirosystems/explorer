'use client';

import { Button as CUIButton, ButtonProps as CUIButtonProps, forwardRef } from '@chakra-ui/react';

import { UIComponent } from './types';

export type ButtonProps = CUIButtonProps & UIComponent;
export const Button = forwardRef<ButtonProps, 'button'>(({ children, ...rest }, ref) => (
  <CUIButton ref={ref} {...rest}>
    {children}
  </CUIButton>
));
