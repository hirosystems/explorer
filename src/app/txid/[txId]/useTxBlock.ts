import { TxDetails } from '@/common/types/tx-v3';

import { useBlockByHash } from '../../../common/queries/useBlockByHeightOrHash';

export function useTxBlock(tx: TxDetails) {
  return useBlockByHash('block' in tx ? tx.block.hash : undefined);
}
