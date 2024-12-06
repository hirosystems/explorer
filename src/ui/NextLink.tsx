import NLink from 'next/link';
import { forwardRef } from 'react';

import { Link, LinkProps } from './Link';

// Link from next/link is a React component that extends the HTML <a> element to provide prefetching
export type NextLinkProps = LinkProps;
export const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(
  ({ children, href = '/', ...linkProps }, ref) => (
    <Link {...linkProps} ref={ref} asChild>
      <NLink href={href}>{children}</NLink>
    </Link>
  )
);
