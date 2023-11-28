'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { TbAlertOctagon } from 'react-icons/tb';

import { Box, BoxProps } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Text, Title } from '../../ui/typography';
import { Circle } from './Circle';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const ErrorMessageLayout: React.FC<
  { title: string; errorStatusCode?: number; message: string; action: any } & BoxProps
> = ({ title, message, errorStatusCode, action }) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Box py="32px" textAlign="center">
      {errorStatusCode ? (
        <Circle
          size="128px"
          mx="auto"
          mb="32px"
          borderColor={`brand.${colorMode}`}
          borderWidth={'2px'}
        >
          <Text fontSize="48px" fontWeight="bold" color={'gray.600'}>
            {errorStatusCode}
          </Text>
        </Circle>
      ) : (
        <Circle size="128px" mx="auto" mb="32px">
          <TbAlertOctagon size="72px" />
        </Circle>
      )}
      <Title mb={'12px'} as="h3">
        {capitalizeFirstLetter(title)}
      </Title>
      <Text lineHeight="1.8" fontSize={'14px'} color={'textBody'}>
        {capitalizeFirstLetter(message)}
      </Text>
      <Flex justifyContent="center">{action}</Flex>
    </Box>
  );
};
