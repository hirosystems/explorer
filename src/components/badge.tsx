import * as React from 'react';
import { Flex, Text, BoxProps, FlexProps } from '@stacks/ui';

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

export const Badge: React.FC<FlexProps> = ({ children, ...rest }) => (
  <Flex
    align="center"
    justify="center"
    borderRadius="24px"
    py="extra-tight"
    px={['tight', 'tight', 'base']}
    color="white"
    {...rest}
  >
    <Label>{children}</Label>
  </Flex>
);
