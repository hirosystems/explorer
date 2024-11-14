'use client';

import { Link as CUILink, LinkProps as CUILinkProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type LinkProps = CUILinkProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, ...rest }, ref) => (
  <CUILink ref={ref} {...rest}>
    {children}
  </CUILink>
));
