'use client';

import { Link, LinkProps, TextProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { Text } from './Text';

export type TextLinkProps = TextProps & LinkProps;
export const TextLink = forwardRef<HTMLParagraphElement, TextLinkProps>(
  ({ children, href, target, ...textProps }, ref) => (
    <Text ref={ref} {...textProps} asChild>
      <Link href={href} target={target}>
        {children}
      </Link>
    </Text>
  )
);

// 'use client';

// import { Text as CUIText, TextProps as CUITextProps, forwardRef } from '@chakra-ui/react';

// export const TextLink = forwardRef<CUITextProps, 'a'>(({ children, ...rest }, ref) => (
//   <CUIText as={'a'} ref={ref} {...rest}>
//     {children}
//   </CUIText>
// ));
