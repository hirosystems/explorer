'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { TbAlertOctagon } from 'react-icons/tb';

import { Box, BoxProps } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { QuestionOctagon } from '../../ui/icons/QuestionOctagon';
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
        <>
          <Circle size="72px" mx="auto" borderWidth={'1px'} mb={'14px'}>
            <Icon as={QuestionOctagon} size="24px" />
            {/*<TbAlertOctagon size="72px" />*/}
          </Circle>
          <Text fontSize="32px" fontWeight="bold" color={'gray.600'}>
            {errorStatusCode}
          </Text>
        </>
      ) : (
        <Circle size="72px" mx="auto" borderWidth={'1px'} mb={'14px'}>
          <Icon as={QuestionOctagon} size="24px" />
          {/*<TbAlertOctagon size="72px" />*/}
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
