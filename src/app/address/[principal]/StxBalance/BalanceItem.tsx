'use client';

import * as React from 'react';

import { useStxPrice } from '../../../../common/queries/useCurrentPrices';
import {
  formatStacksAmount,
  getLocaleDecimalSeparator,
  getUsdValue,
} from '../../../../common/utils/utils';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';

function UsdBalanceBase({ balance }: { balance: number }) {
  const { data: stxPrice } = useStxPrice();
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
    <Flex flexDirection="column" as="span" {...rest} style={{ userSelect: 'all' }} fontSize={'sm'}>
      <Flex>
        <Text fontWeight="semibold">{parts[0]}</Text>
        <Text fontWeight="semibold">
          {localeDecimalSeparator}
          {parts[1]}
        </Text>
        <Text fontWeight="semibold" ml={1}>
          STX
        </Text>
      </Flex>
      <UsdBalance balance={balance} />
    </Flex>
  );
}
