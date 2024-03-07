'use client';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useSuspenseStxPrice } from '../../queries/useCurrentPrices';

export const useStxPriceForTx = (tx: Transaction | MempoolTransaction) => {
  const hasBlockHeight = 'block_height' in tx;
  const blockBurnTime = hasBlockHeight
    ? tx.parent_burn_block_time_iso || tx.burn_block_time_iso
    : undefined;
  const { data: historicalStxPrice } = useSuspenseStxPrice(blockBurnTime, {
    enabled: !!blockBurnTime,
  });
  const { data: currentStxPrice } = useSuspenseStxPrice();
  return { historicalStxPrice, currentStxPrice };
};
