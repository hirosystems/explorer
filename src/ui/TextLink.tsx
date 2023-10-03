import { forwardRef, Text as CUIText, TextProps as CUITextProps } from '@chakra-ui/react';

export const TextLink = forwardRef<CUITextProps, 'a'>(({ children, ...rest }, ref) => (
  <CUIText as="a" ref={ref} {...rest}>
    {children}
  </CUIText>
));
