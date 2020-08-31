import * as React from 'react';
import { Text } from '@components/typography';
import { BoxProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

type LinkProps = { onClick?: any } & BoxProps;

export const Link: React.FC<LinkProps> = forwardRefWithAs<LinkProps, 'a'>(
  ({ as = 'a', ...props }, ref) => {
    return (
      <Text
        as={as}
        textDecoration="underline"
        _hover={{
          color: 'var(--colors-text-hover)',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
