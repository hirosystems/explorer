import * as React from 'react';
import { Text } from '@components/typography';
import { BoxProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

type LinkProps = { onClick?: any } & BoxProps;

export const Link: ForwardRefExoticComponentWithAs<LinkProps, 'a'> = forwardRefWithAs<
  LinkProps,
  'a'
>(({ as = 'a', ...props }, ref) => {
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
});
