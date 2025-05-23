'use client';

import { FC, useCallback, useMemo, useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { Button } from '../../../ui/Button';
import { Tooltip } from '../../../ui/Tooltip';
import { useGlobalContext } from '../../context/useGlobalContext';
import { getUsdValue } from '../../utils/utils';
import { useStxPriceForTx } from './useStxPriceForTx';

const initialTooltipContent = 'Displaying current value; Click to show value on day of txn';

const tooltipContent = ['Current value', 'Estimated value on day of txn']; // TODO: add historical value

interface StxPriceButtonProps {
  tx: Transaction | MempoolTransaction;
  value: number;
}

const StxPriceButtonBase: FC<StxPriceButtonProps> = ({ tx, value }) => {
  const { historicalStxPrice, currentStxPrice } = useStxPriceForTx(tx);
  const [tooltipContentIndex, setTooltipContentIndex] = useState(0);
  const [initialRender, setInitialRender] = useState(true);
  const toggleStxPrice = useCallback(() => {
    if (initialRender) setInitialRender(false);
    if (!!historicalStxPrice) {
      setTooltipContentIndex((tooltipContentIndex + 1) % tooltipContent.length);
    }
  }, [initialRender, tooltipContentIndex, historicalStxPrice]);
  const showCurrentPriceForCompletedTransactions = tooltipContentIndex !== 1;
  const currentPriceFormatted = useMemo(
    () => getUsdValue(value, currentStxPrice, true),
    [currentStxPrice, value]
  );
  const historicalPriceFormatted = useMemo(
    () => getUsdValue(value, historicalStxPrice, true),
    [historicalStxPrice, value]
  );

  const isMainnet = useGlobalContext().activeNetwork.mode === 'mainnet';

  if (!isMainnet) {
    return null;
  }

  return (
    <Tooltip content={initialRender ? initialTooltipContent : tooltipContent[tooltipContentIndex]}>
      <Button
        size={'xs'}
        ml={2}
        onClick={toggleStxPrice}
        fontSize={'xs'}
        _focus={{ outline: 0 }}
        flexShrink={0}
        suppressHydrationWarning={true}
        bg={'stxPrice.background'}
        _hover={{ bg: 'purple.300' }}
        color={'black'}
      >
        {showCurrentPriceForCompletedTransactions
          ? currentPriceFormatted
          : historicalPriceFormatted}
      </Button>
    </Tooltip>
  );
};

export function StxPriceButton(props: StxPriceButtonProps) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <StxPriceButtonBase {...props} />
    </ExplorerErrorBoundary>
  );
}
