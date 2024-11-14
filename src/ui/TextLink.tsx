'use client';

import { Text as CUIText, TextProps as CUITextProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TextLinkProps = CUITextProps & UIComponent;
export const TextLink = forwardRef<HTMLParagraphElement, TextLinkProps>(
  ({ children, ...rest }, ref) => (
    <CUIText as={'a'} ref={ref} {...rest}>
      {children}
    </CUIText>
  )
);
