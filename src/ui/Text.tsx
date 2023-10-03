import {
  forwardRef,
  Text as CUIText,
  TextProps as CUITextProps,
  useColorMode,
} from '@chakra-ui/react';

export type TextProps = CUITextProps;
export const Text = forwardRef<TextProps, 'span'>(({ as = 'span', children, ...rest }, ref) => (
  <CUIText
    as={as}
    ref={ref}
    display="block"
    borderColor={`border.${useColorMode().colorMode}`}
    {...rest}
  >
    {children}
  </CUIText>
));
