import { FC, useCallback, useMemo, useState } from 'react';
import * as React from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Button, Text, Tooltip, color, useColorMode } from '@stacks/ui';

import { getUsdValue } from '@common/utils';

import { useStxPriceForTx } from '@modules/stxPrice/useStxPriceForTx';

const initialTooltipContent = 'Displaying current value; Click to show value on day of txn';

const tooltipContent = ['Current value', 'Estimated value on day of txn'];

interface StxPriceButtonProps {
  tx: Transaction | MempoolTransaction;
  value: number;
}

export const StxPriceButton: FC<StxPriceButtonProps> = ({ tx, value }) => {
  const hasBlockHeight = 'block_height' in tx;
  const { historicalStxPrice, currentStxPrice } = useStxPriceForTx(tx);
  const [tooltipContentIndex, setTooltipContentIndex] = useState(0);
  const [initialRender, setInitialRender] = useState(true);
  const toggleStxPrice = useCallback(() => {
    if (initialRender) setInitialRender(false);
    setTooltipContentIndex((tooltipContentIndex + 1) % tooltipContent.length);
  }, [tooltipContentIndex]);
  const showCurrentPriceForCompletedTransactions = tooltipContentIndex !== 1;
  const currentPriceFormatted = useMemo(
    () => getUsdValue(value, currentStxPrice, true),
    [currentStxPrice, value]
  );
  const historicalPriceFormatted = useMemo(
    () => getUsdValue(value, historicalStxPrice, true),
    [historicalStxPrice, value]
  );
  const { colorMode } = useColorMode();
  if (hasBlockHeight) {
    return (
      <Tooltip label={initialRender ? initialTooltipContent : tooltipContent[tooltipContentIndex]}>
        <Button
          size={'sm'}
          bg={colorMode === 'light' ? '#e9e8ff' : color('bg-4')}
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
          color={color('text-body')}
          _hover={{
            bg: colorMode === 'light' ? '#d9d7ff' : color('bg-4'),
            color: colorMode === 'light' ? undefined : color('brand'),
          }}
          ml={'5px'}
          onClick={toggleStxPrice}
          fontSize={'14px !important'}
          _focus={{ outline: 0 }}
        >
          {showCurrentPriceForCompletedTransactions
            ? currentPriceFormatted
            : historicalPriceFormatted}
        </Button>
      </Tooltip>
    );
  }
  return (
    <Text color="ink.400" ml={['none', 'none', 'base']}>
      {currentPriceFormatted}
    </Text>
  );
};
