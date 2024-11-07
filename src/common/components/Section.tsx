'use client';

import { Box, Flex, FlexProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

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
  return (
    <Card px={px} height={'fit-content'} {...rest}>
      {title || TopRight ? (
        <Flex
          alignItems={'center'}
          justifyContent="space-between"
          borderBottom="1px solid var(--stacks-colors-border-secondary)"
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
              <Text color={'text'} fontWeight="medium" whiteSpace="nowrap">
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
