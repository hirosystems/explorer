import Link from 'next/link';
import * as React from 'react';

import { Box, BoxProps, Flex, color } from '@stacks/ui';

import { Button, blue } from '@components/button';
import { Circle } from '@components/circle';
import { Text, Title } from '@components/typography';

export const MessageWithIcon: React.FC<
  { title: string; icon: any; message: string; action: any } & BoxProps
> = ({ title, message, icon: Icon, action }) => (
  <Box py="extra-loose" maxWidth="38ch" textAlign="center">
    <Circle bg={blue(0.2)} color={color('accent')} size="128px" mx="auto" mb="extra-loose">
      <Icon size="72px" />
    </Circle>
    <Title mt={0} as="h3">
      {title}
    </Title>
    <Text lineHeight="1.8" color={color('text-body')}>
      {message}
    </Text>
    <Flex justifyContent="center">{action}</Flex>
  </Box>
);
