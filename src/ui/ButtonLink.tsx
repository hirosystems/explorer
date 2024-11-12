'use client';

import { Link } from '@chakra-ui/next-js';
import { forwardRef } from 'react';

import { Button, ButtonProps } from './Button';

export type ButtonLinkProps = ButtonProps;
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, ...rest }, ref) => (
    <Button as={Link} {...rest}>
      {children}
    </Button>
  )
);
