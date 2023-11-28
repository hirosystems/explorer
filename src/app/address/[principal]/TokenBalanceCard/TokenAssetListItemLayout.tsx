'use client';

import { ReactNode } from 'react';

import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { Caption } from '../../../../ui/typography';

export function TokenAssetListItemLayout({
  icon,
  asset,
  symbol,
  link,
  amount,
}: {
  icon: ReactNode;
  asset: ReactNode;
  symbol: ReactNode;
  link: ReactNode;
  amount: ReactNode;
}) {
  return (
    <Flex justifyContent="space-between" px="16px" py="16px">
      <Box>
        <Flex alignItems="center" mb={'4px'} gap={'4px'}>
          {icon}
          <Stack spacing="4px">
            <Text color={'textTitle'} fontWeight="600">
              {asset}
            </Text>
            <HStack gap="4px" divider={<Caption>∙</Caption>} wrap="wrap">
              {symbol}
              {link}
            </HStack>
          </Stack>
        </Flex>
      </Box>
      <Flex justifyContent="flex-end" alignItems="center" textAlign="right">
        {amount}
      </Flex>
    </Flex>
  );
}
