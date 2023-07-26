import { Flex, FlexProps } from '@/ui/components';
import React, { FC } from 'react';
import { forwardRef } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';
import { useGlobalContext } from '@/common/context/useAppContext';
import { buildUrl } from '@/app/common/utils/buildUrl';

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
