import * as React from 'react';
import { Flex, FlexProps } from '@stacks/ui';
import { border } from '@common/utils';

export const Card: React.FC<FlexProps> = React.memo(props => (
  <Flex flexDir="column" borderRadius="12px" border={border()} {...props} />
));
