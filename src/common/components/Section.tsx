'use client';

import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Box } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { Text } from '../../ui/Text';
import { Card } from './Card';

interface SectionProps extends Omit<FlexProps, 'title'> {
  title?: string | ReactNode;
  topRight?: ReactNode;
}

export function Section({
  title,
  topRight: TopRight = null,
  children,
  overflowY,
  px = 6,
  ...rest
}: SectionProps) {
  const titleColor = useColorModeValue('slate.900', 'white'); // TODO: remove
  return (
    <Card px={px} height={'fit-content'} {...rest}>
      {title || TopRight ? (
        <Flex
          alignItems={'center'}
          justifyContent="space-between"
          borderBottom="1px"
          borderColor="borderSecondary"
          borderTopRightRadius="xl"
          borderTopLeftRadius="xl"
          flexShrink={0}
          px={6}
          py={4}
          mx={-px}
          gap={4}
          flexWrap="wrap"
        >
          {title ? (
            typeof title === 'string' ? (
              <Text color={titleColor} fontWeight="medium" whiteSpace="nowrap">
                {title}
              </Text>
            ) : (
              title
            )
          ) : null}
          {TopRight ? (
            <Flex justifyContent="flex-end" alignItems="center">
              {TopRight}
            </Flex>
          ) : null}
        </Flex>
      ) : null}
      <Box position={'relative'}>{children}</Box>
    </Card>
  );
}
