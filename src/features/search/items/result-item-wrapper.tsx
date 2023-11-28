import { forwardRef } from '@chakra-ui/react';
import React from 'react';

import { Flex, FlexProps } from '../../../ui/Flex';

export const ResultItemWrapper = forwardRef<FlexProps, 'div'>(({ children, ...rest }, ref) => (
  <Flex ref={ref}>
    <Flex
      as={'a'}
      p="24px"
      alignItems="center"
      position="relative"
      justifyContent="space-between"
      flexGrow={1}
      {...rest}
    >
      <Flex flexGrow={1} alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Flex>
  </Flex>
));
