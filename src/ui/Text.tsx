'use client';

import { Text as CUIText, TextProps as CUITextProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TextProps = CUITextProps & UIComponent;
export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as = 'span', children, ...rest }, ref) => (
    <CUIText as={as} ref={ref} display={'block'} {...rest}>
      {children}
    </CUIText>
  )
);
