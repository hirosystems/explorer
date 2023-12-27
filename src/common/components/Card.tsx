'use client';

import { useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

import { Flex, FlexProps } from '../../ui/Flex';
import { useColorMode } from '../../ui/hooks/useColorMode';

export function Card(props: FlexProps) {
  const borderColor = useColorModeValue('slate.150', 'slate.900');
  return (
    <Flex
      flexDirection="column"
      borderRadius="xl"
      bg={useColorModeValue('white', 'black')}
      border={'1px'}
      borderColor={borderColor}
      boxShadow={'0px 1px 2px 0px var(--stacks-colors-blackAlpha-50)'}
      {...props}
    />
  );
}
