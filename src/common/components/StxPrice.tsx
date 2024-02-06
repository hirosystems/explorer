'use client';

import { useColorModeValue } from '@chakra-ui/react';
import { FC, useMemo } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../app/_components/ErrorBoundary';
import { Flex } from '../../ui/Flex';
import { useAppSelector } from '../state/hooks';
import { TransactionValueFilterTypes } from '../state/slices/transaction-value-filter-slice';
import { getUsdValue } from '../utils/utils';
import { useStxPriceForTx } from './StxPriceButton/useStxPriceForTx';

interface StxPriceProps {
  tx: Transaction | MempoolTransaction;
  value: number;
}

const StxPriceBase: FC<StxPriceProps> = ({ tx, value }) => {
  const { historicalStxPrice, currentStxPrice } = useStxPriceForTx(tx);

  const activeTransactionValueFilter = useAppSelector(
    state => state.activeTransactionValueFilter.activeTransactionValueFilter
  );
  const currentPriceFormatted = useMemo(
    () => getUsdValue(value, currentStxPrice, true),
    [currentStxPrice, value]
  );
  const historicalPriceFormatted = useMemo(
    () => getUsdValue(value, historicalStxPrice, true),
    [historicalStxPrice, value]
  );

  return (
    <Flex
      height="24px"
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius="md"
      padding="0px 8px"
      ml={'5px'}
      fontSize={'xs'}
      _focus={{ outline: 0 }}
      flexShrink={0}
      suppressHydrationWarning={true}
      bg={useColorModeValue('purple.200', 'purple.400')}
      _hover={{ bg: useColorModeValue('purple.300', 'purple.300') }}
      color={'black'}
    >
      {activeTransactionValueFilter === TransactionValueFilterTypes.CurrentValue
        ? currentPriceFormatted
        : historicalPriceFormatted}
    </Flex>
  );
};

export function StxPrice(props: StxPriceProps) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <StxPriceBase {...props} />
    </ExplorerErrorBoundary>
  );
}
