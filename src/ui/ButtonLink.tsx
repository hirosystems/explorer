'use client';

import { forwardRef } from 'react';

import { Button, ButtonProps } from './Button';
import { NextLink } from './NextLink';

export type ButtonLinkProps = ButtonProps;
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, ...rest }, ref) => (
    <Button as={NextLink} ref={ref} {...rest}>
      {children}
    </Button>
  )
);
