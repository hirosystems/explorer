'use client';

import { Link as CUILink, LinkProps as CUILinkProps } from '@chakra-ui/react';
import { forwardRef } from '@chakra-ui/react';

export type LinkProps = CUILinkProps;

export const Link = forwardRef<LinkProps, 'a'>(({ children, size, ...rest }, ref) => (
  <CUILink ref={ref} {...rest}>
    {children}
  </CUILink>
));
