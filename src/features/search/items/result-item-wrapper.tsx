import { Flex, FlexProps } from '@/ui/components';
import React, { FC } from 'react';

export const ResultItemWrapper: FC<FlexProps> = ({ children, ...rest }) => (
  <Flex>
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
);
