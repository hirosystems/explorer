'use client';

import { Link, TextProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { Text } from './Text';

export type TextLinkProps = TextProps & { href?: string; target?: string };
export const TextLink = forwardRef<HTMLParagraphElement, TextLinkProps>(
  ({ children, href, target, ...textProps }, ref) => (
    <Text ref={ref} {...textProps} asChild>
      <Link href={href} target={target}>
        {children}
      </Link>
    </Text>
  )
);
