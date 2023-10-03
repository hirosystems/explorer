import { forwardRef } from '@chakra-ui/react';
import Link from 'next/link';

import { Button, ButtonProps } from './Button';

export type ButtonLink = ButtonProps;
export const ButtonLink = forwardRef<ButtonProps, 'a'>(({ children, ...rest }, ref) => (
  <Button as={Link} {...rest}>
    {children}
  </Button>
));
