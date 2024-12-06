'use client';

import { forwardRef } from 'react';

import { Button, ButtonProps } from '../components/ui/button';
import { NextLink, NextLinkProps } from './NextLink';

export type ButtonLinkProps = ButtonProps & NextLinkProps;
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, ...buttonProps }, ref) => (
    <Button asChild {...buttonProps}>
      <NextLink ref={ref}>{children}</NextLink>
    </Button>
  )
);
