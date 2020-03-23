import * as React from 'react';
import { Flex, FlexProps } from '@blockstack/ui';

export const Card: React.FC<FlexProps> = props => (
  <Flex flexDir="column" borderRadius="12px" border="1px solid" borderColor="inherit" {...props} />
);
