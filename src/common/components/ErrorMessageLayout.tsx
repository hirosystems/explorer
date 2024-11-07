'use client';

import { Box, BoxProps, Flex, Icon } from '@chakra-ui/react';
import * as React from 'react';

import { Text } from '../../ui/Text';
import { QuestionOctagon } from '../../ui/icons/QuestionOctagon';
import { Circle } from './Circle';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const ErrorMessageLayout: React.FC<
  { title: string; errorStatusCode?: number; message: string; action: any } & BoxProps
> = ({ title, message, errorStatusCode, action }) => {
  return (
    <Box py="32px" textAlign="center">
      {errorStatusCode ? (
        <>
          <Circle h="72px" w="72px" mx="auto" borderWidth={'1px'} mb={'14px'}>
            <Icon h={6} w={6}>
              <QuestionOctagon />
            </Icon>
          </Circle>
          <Text fontSize="32px" fontWeight="bold" color={'gray.600'}>
            {errorStatusCode}
          </Text>
        </>
      ) : (
        <Circle h="72px" w="72px" mx="auto" borderWidth={'1px'} mb={'14px'}>
          <Icon h={6} w={6}>
            <QuestionOctagon />
          </Icon>
        </Circle>
      )}
      <Text mb={'12px'} fontSize="16px">
        {capitalizeFirstLetter(title)}
      </Text>
      <Text lineHeight="1.8" fontSize={'14px'}>
        {capitalizeFirstLetter(message)}
      </Text>
      <Flex justifyContent="center">{action}</Flex>
    </Box>
  );
};
