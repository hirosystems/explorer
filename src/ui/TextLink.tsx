'use client';

import { Text as CUIText, TextProps as CUITextProps, forwardRef } from '@chakra-ui/react';

export const TextLink = forwardRef<CUITextProps, 'a'>(({ children, ...rest }, ref) => (
  <CUIText as={'a'} ref={ref} {...rest}>
    {children}
  </CUIText>
));
