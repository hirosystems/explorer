import * as React from 'react';
import { Flex, Text, BoxProps, FlexProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

const Label: React.FC<BoxProps> = props => (
  <Text
    display="block"
    lineHeight="16px"
    fontSize={['10px', '10px', '11px']}
    fontWeight={600}
    color="currentColor"
    {...props}
  />
);
export type BadgeProps = FlexProps & { labelProps?: BoxProps };
export const Badge: ForwardRefExoticComponentWithAs<BadgeProps, 'div'> = forwardRefWithAs(
  ({ children, labelProps = {}, ...rest }, ref) => (
    <Flex
      alignItems="center"
      justify="center"
      borderRadius="24px"
      py="extra-tight"
      px={['tight', 'tight', 'base-tight']}
      color="white"
      ref={ref}
      {...rest}
    >
      <Label {...labelProps}>{children}</Label>
    </Flex>
  )
);
