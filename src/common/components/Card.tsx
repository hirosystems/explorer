'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';

import { Flex, FlexProps } from '../../ui/Flex';

export const Card: React.FC<FlexProps> = React.memo(props => (
  <Flex
    flexDirection="column"
    borderRadius="12px"
    borderWidth="1px"
    bg={`bg.${useColorMode().colorMode}`}
    {...props}
  />
));
