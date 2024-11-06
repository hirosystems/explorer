import { Box } from '@/ui/Box';
import { Flex, FlexProps } from '@/ui/Flex';
import { Stack, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Text } from '../../../ui/Text';
import { Card } from '../Card';

function Toolbar({
  topLeft,
  topRight,
  title,
}: {
  topLeft?: string | ReactNode;
  topRight?: ReactNode;
  title?: string | ReactNode;
}) {
  const titleColor = useColorModeValue('slate.900', 'white');

  if (!title && !topLeft && !topRight) {
    return null;
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex
        alignItems="flex-start"
        justifyContent="space-between"
        flexShrink={0}
        direction={['column', 'row']}
        gap={4}
      >
        {title ? (
          <Text color={titleColor} fontWeight="normal" fontSize="3.5xl">
            {title}
          </Text>
        ) : topLeft ? (
          topLeft
        ) : null}
      </Flex>
      {topRight && (
        <Flex justifyContent="flex-end" alignItems="center">
          {topRight}
        </Flex>
      )}
    </Flex>
  );
}

interface TableContainerProps extends FlexProps {
  topLeft?: ReactNode;
  topRight?: ReactNode;
  title?: string;
}

export function TableContainer({
  topLeft,
  topRight,
  title,
  children,
  ...rest
}: TableContainerProps) {
  if (title === 'Blocks') {
    throw new Error('Blocks table is not implemented');
  }
  return (
    <Stack gap={7} w="full">
      <Toolbar topLeft={topLeft} topRight={topRight} title={title} />
      <Card h="fit-content" w="full" px={6} {...rest}>
        <Box position={'relative'}>{children}</Box>
      </Card>
    </Stack>
  );
}
