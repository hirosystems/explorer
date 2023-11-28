'use client';

import * as React from 'react';

import { useSuspenseCurrentStxPrice } from '../../../../common/queries/useCurrentPrices';
import {
  formatStacksAmount,
  getLocaleDecimalSeparator,
  getUsdValue,
} from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';

function UsdBalanceBase({ balance }: { balance: number }) {
  const { data: stxPrice } = useSuspenseCurrentStxPrice();
  const usdBalance = getUsdValue(balance, stxPrice);

  if (!usdBalance) {
    return null;
  }

  return (
    <Text mt="4px" color="ink.400" fontSize="14px" suppressHydrationWarning>
      {usdBalance}
    </Text>
  );
}

function UsdBalance({ balance }: { balance: number }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <UsdBalanceBase balance={balance} />
    </ExplorerErrorBoundary>
  );
}

export function BalanceItem({ balance, ...rest }: { balance: number } & FlexProps) {
  const formattedBalance = formatStacksAmount(balance);
  const localeDecimalSeparator = getLocaleDecimalSeparator() || '.';
  const parts = formattedBalance.split(localeDecimalSeparator);

  return (
    <Flex flexDirection="column" as="span" {...rest} style={{ userSelect: 'all' }}>
      <Flex>
        <Text color="currentColor">{parts[0]}</Text>
        <Text color="currentColor" opacity={0.65}>
          {localeDecimalSeparator}
          {parts[1]}
        </Text>
        <Text ml="4px" color="currentColor">
          STX
        </Text>
      </Flex>
      <UsdBalance balance={balance} />
    </Flex>
  );
}
