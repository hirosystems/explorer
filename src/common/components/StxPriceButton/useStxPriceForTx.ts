'use client';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useHomePageData } from '../../../app/context';
import { useStxPrice } from '../../queries/useCurrentPrices';

export const useStxPriceForTx = (tx: Transaction | MempoolTransaction) => {
  const hasBlockHeight = 'block_height' in tx;
  const blockBurnTime = hasBlockHeight
    ? tx.parent_burn_block_time_iso || tx.burn_block_time_iso
    : undefined;
  
  // Only fetch historical price if we have a block time, get current price from context
  const { data: historicalStxPrice } = useStxPrice(blockBurnTime, {
    enabled: !!blockBurnTime,
  });
  
  // Get current price from global context instead of making API call
  const { stxPrice: currentStxPrice } = useHomePageData();
  
  return { historicalStxPrice, currentStxPrice };
};
