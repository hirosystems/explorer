'use client';

import dayjs from 'dayjs';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import {
  useSuspenseCurrentStxPrice,
  useSuspenseHistoricalStxPrice,
} from '../../queries/useCurrentPrices';

export const useStxPriceForTx = (tx: Transaction | MempoolTransaction) => {
  const hasBlockHeight = 'block_height' in tx;
  const blockBurnTime = hasBlockHeight
    ? tx.parent_burn_block_time_iso || tx.burn_block_time_iso
    : undefined;
  const { data: historicalStxPrice } = useSuspenseHistoricalStxPrice(
    dayjs(blockBurnTime).format('DD-MM-YYYY'),
    { enabled: !!blockBurnTime }
  );
  const { data: currentStxPrice } = useSuspenseCurrentStxPrice();
  return { historicalStxPrice, currentStxPrice };
};
