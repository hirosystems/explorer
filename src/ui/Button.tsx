'use client';

import {
  Button as CUIButton,
  ButtonProps as CUIButtonProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type ButtonProps = CUIButtonProps & UIComponent;
export const Button = forwardRef<ButtonProps, 'button'>(({ children, ...rest }, ref) => (
  <CUIButton
    ref={ref}
    bg={`accent.${useColorMode().colorMode}`}
    color={'white'}
    fontSize={'14px'}
    _hover={{ bg: 'accent.dark' }}
    {...rest}
  >
    {children}
  </CUIButton>
));
