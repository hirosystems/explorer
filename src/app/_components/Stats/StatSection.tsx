'use client';

import { Box, Flex, Stack, StackProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { Text } from '../../../ui/Text';

export const StatSectionLayout: FC<
  {
    title: ReactNode;
    bodyMainText: ReactNode;
    bodySecondaryText: ReactNode;
    caption: ReactNode;
  } & Omit<StackProps, 'title'>
> = ({ title, bodyMainText, bodySecondaryText, caption, ...rest }) => (
  <Stack
    p={5}
    gap={0}
    height={32}
    justifyContent={'center'}
    borderColor={'borderPrimary'}
    {...rest}
  >
    <Box mb={3} w={'full'}>
      {title}
    </Box>
    <Box mb={2} w={'full'}>
      <Flex alignItems={'baseline'} wrap={'nowrap'} minW={'0'} gap={0.5} fontWeight={'medium'}>
        {bodyMainText}
        {bodySecondaryText}
      </Flex>
    </Box>
    <Box w={'full'}>{caption}</Box>
  </Stack>
);

export const StatSection: FC<
  {
    title: ReactNode;
    bodyMainText: ReactNode;
    bodySecondaryText: ReactNode;
    caption: ReactNode;
  } & Omit<StackProps, 'title'>
> = ({ title, bodyMainText, bodySecondaryText, caption, ...rest }) => (
  <StatSectionLayout
    title={
      <Text fontSize={'xs'} fontWeight="semibold" whiteSpace={'nowrap'}>
        {title}
      </Text>
    }
    bodyMainText={
      <Text
        fontSize={'xl'}
        whiteSpace={'nowrap'}
        textOverflow={'ellipsis'}
        overflow={'hidden'}
        color={'text'}
        fontWeight={'medium'}
      >
        {bodyMainText}
      </Text>
    }
    bodySecondaryText={
      <Text fontSize={'sm'} color={'textSubdued'} whiteSpace={'nowrap'} fontWeight={'medium'}>
        {bodySecondaryText}
      </Text>
    }
    caption={
      <Text fontSize={'xs'} lineHeight={'none'} fontWeight="medium" color={'textSubdued'}>
        {caption}
      </Text>
    }
    {...rest}
  />
);
