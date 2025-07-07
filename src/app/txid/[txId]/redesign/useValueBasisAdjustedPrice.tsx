import { useStxPriceForTx } from '@/common/components/StxPriceButton/useStxPriceForTx';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { useAppSelector } from '@/common/state/hooks';
import { TransactionValueFilterTypes } from '@/common/state/slices/transaction-value-filter-slice';
import { getUsdValue } from '@/common/utils/utils';
import { useMemo } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export const useTxValueBasisAdjustedStxPrice = (
  tx: Transaction | MempoolTransaction,
  tokenAmount: number
) => {
  const { historicalStxPrice, currentStxPrice } = useStxPriceForTx(tx);

  const currentPriceFormatted = useMemo(
    () => getUsdValue(tokenAmount, currentStxPrice, true),
    [currentStxPrice, tokenAmount]
  );
  const historicalPriceFormatted = useMemo(
    () => getUsdValue(tokenAmount, historicalStxPrice, true),
    [historicalStxPrice, tokenAmount]
  );

  const activeTransactionValueFilter = useAppSelector(
    state => state.activeTransactionValueFilter.activeTransactionValueFilter
  );

  const isMainnet = useGlobalContext().activeNetwork.mode === 'mainnet';

  return isMainnet
    ? activeTransactionValueFilter === TransactionValueFilterTypes.CurrentValue
      ? currentPriceFormatted
      : historicalPriceFormatted
    : undefined;
};
