import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { useCurrentStxPrice, useHistoricalStxPrice } from '@common/hooks/use-current-prices';
import dayjs from 'dayjs';

export const useStxPriceForTx = (tx: Transaction | MempoolTransaction) => {
  const hasBlockHeight = 'block_height' in tx;
  const blockBurnTime = hasBlockHeight
    ? tx.parent_burn_block_time_iso || tx.burn_block_time_iso
    : undefined;
  const { data: historicalStxPrice } = useHistoricalStxPrice(
    dayjs(blockBurnTime).format('DD-MM-YYYY'),
    { enabled: !!blockBurnTime }
  );
  const { data: currentStxPrice } = useCurrentStxPrice();
  return { historicalStxPrice, currentStxPrice };
};
