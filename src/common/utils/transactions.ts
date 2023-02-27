import { TransactionStatus } from '@/common/constants';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export function getTransactionStatus(tx: Transaction | MempoolTransaction) {
  if (tx?.tx_status === 'pending') {
    return TransactionStatus.PENDING;
  } else if (tx?.tx_status === 'success' && (tx.is_unanchored || tx?.block_hash === '0x')) {
    return TransactionStatus.SUCCESS_MICROBLOCK;
  } else if (tx?.tx_status === 'success' && !tx.is_unanchored) {
    if (!tx.canonical || !tx.microblock_canonical) {
      return TransactionStatus.NON_CANONICAL;
    } else {
      return TransactionStatus.SUCCESS_ANCHOR_BLOCK;
    }
  } else if (tx?.tx_status === 'abort_by_response' || tx?.tx_status === 'abort_by_post_condition') {
    return TransactionStatus.FAILED;
  }
}
