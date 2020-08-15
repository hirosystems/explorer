import { Box, Flex, FlexProps } from '@stacks/ui';
import { Text } from '@components/typography';

import { Card } from '@components/card';
import React from 'react';

import { border } from '@common/utils';
import { color } from '@components/color-modes';

interface SectionProps extends FlexProps {
  title: string;
}

const SectionHeader: React.FC<SectionProps> = ({ title, children, ...rest }) => (
  <Flex bg={color('bg')} justifyContent="space-between" borderBottom={border()} p="base" {...rest}>
    <Box>
      <Text color={color('text-title')} fontWeight="500">
        {title}
      </Text>
    </Box>
    {children}
  </Flex>
);

export const Section: React.FC<{ topRight?: any } & SectionProps> = ({
  title,
  topRight = null,
  children,
  ...rest
}) => {
  return (
    <Card overflow="hidden" bg={color('bg')} {...rest}>
      <SectionHeader title={title}>{topRight}</SectionHeader>
      <Flex flexDirection="column">{children}</Flex>
    </Card>
  );
};
