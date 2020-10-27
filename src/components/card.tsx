import * as React from 'react';
import { Flex, FlexProps } from '@stacks/ui';

export const Card: React.FC<FlexProps> = React.memo(props => (
  <Flex
    flexDir="column"
    borderRadius="12px"
    border="1px solid"
    borderColor="var(--colors-border)"
    {...props}
  />
));
