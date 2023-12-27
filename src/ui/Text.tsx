'use client';

import {
  Text as CUIText,
  TextProps as CUITextProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

export type TextProps = CUITextProps;
export const Text = forwardRef<TextProps, 'span'>(({ as = 'span', children, ...rest }, ref) => (
  <CUIText as={as} ref={ref} display={'block'} {...rest}>
    {children}
  </CUIText>
));
