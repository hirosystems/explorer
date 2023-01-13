import { Circle } from '@/components/circle';
import { Box, BoxProps, Flex } from '@/ui/components';
import { Text, Title } from '@/ui/typography';
import * as React from 'react';

export const MessageWithIcon: React.FC<
  { title: string; icon: any; message: string; action: any } & BoxProps
> = ({ title, message, icon: Icon, action }) => (
  <Box py="32px" maxWidth="38ch" textAlign="center">
    <Circle color={'accent'} size="128px" mx="auto" mb="32px">
      <Icon size="72px" />
    </Circle>
    <Title mt={0} as="h3">
      {title}
    </Title>
    <Text lineHeight="1.8" color={'textBody'}>
      {message}
    </Text>
    <Flex justifyContent="center">{action}</Flex>
  </Box>
);
