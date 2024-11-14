import NLink from 'next/link';
import { forwardRef } from 'react';

import { Link, LinkProps } from './Link';

// Link from next/link is a React component that extends the HTML <a> element to provide prefetching
export const NextLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, href = '/', ...rest }, ref) => (
    <Link {...rest} asChild>
      <NLink ref={ref} href={href}>
        {children}
      </NLink>
    </Link>
  )
);
