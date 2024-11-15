'use client';

// import { Button, ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { Button, ButtonProps } from './Button';
import { NextLink, NextLinkProps } from './NextLink';

export type ButtonLinkProps = ButtonProps & NextLinkProps;
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, ...buttonProps }, ref) => (
    <Button asChild {...buttonProps}>
      <NextLink ref={ref}>{children}</NextLink>
    </Button>
  )
);
