'use client';

import { FC, ReactNode } from 'react';
import * as React from 'react';

import { Box } from '../../../ui/Box';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { Text } from '../../../ui/Text';

export const StatSection: FC<
  {
    title: ReactNode;
    bodyMainText: ReactNode;
    bodySecondaryText: ReactNode;
    caption: ReactNode;
  } & Omit<FlexProps, 'title'>
> = ({ title, bodyMainText, bodySecondaryText, caption, ...rest }) => (
  <Flex
    direction={'column'}
    p={5}
    height={32}
    justifyContent={'center'}
    borderColor={'border'}
    {...rest}
  >
    <Text fontSize={'xs'} fontWeight="semibold" mb={3} whiteSpace={'nowrap'}>
      {title}
    </Text>
    <Flex mb={2} alignItems={'baseline'} wrap={'nowrap'} minW={'0'} gap={0.5} fontWeight={'medium'}>
      <Text
        fontSize={'xl'}
        whiteSpace={'nowrap'}
        textOverflow={'ellipsis'}
        overflow={'hidden'}
        color={'text'}
      >
        {bodyMainText}
      </Text>
      <Text fontSize={'sm'} color={'secondaryText'} whiteSpace={'nowrap'}>
        {bodySecondaryText}
      </Text>
    </Flex>
    <Text fontSize={'xs'} lineHeight={'none'} fontWeight="medium" color={'secondaryText'}>
      {caption}
    </Text>
  </Flex>
);
