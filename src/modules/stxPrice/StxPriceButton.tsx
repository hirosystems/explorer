import { FC, useCallback, useMemo, useState } from 'react';
import { Button, color, Text, Tooltip } from '@stacks/ui';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { useStxPriceForTx } from '@modules/stxPrice/useStxPriceForTx';
import { getUsdValue } from '@common/utils';
import * as React from 'react';

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
  if (hasBlockHeight) {
    return (
      <Tooltip label={initialRender ? initialTooltipContent : tooltipContent[tooltipContentIndex]}>
        <Button
          size={'sm'}
          bg={'#e9e8ff'}
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
          color={color('text-body')}
          _hover={{ bg: '#d9d7ff' }}
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
