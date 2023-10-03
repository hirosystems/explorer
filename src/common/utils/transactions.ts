import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionStatus } from '@/common/constants';

export function getTransactionStatus(tx?: Transaction | MempoolTransaction) {
  if (tx?.tx_status === 'pending') {
    return TransactionStatus.PENDING;
  }
  if (tx?.tx_status === 'success' && (tx.is_unanchored || tx?.block_hash === '0x')) {
    return TransactionStatus.SUCCESS_MICROBLOCK;
  }
  if (tx?.tx_status === 'success' && !tx.is_unanchored) {
    if (!tx.canonical || !tx.microblock_canonical) {
      return TransactionStatus.NON_CANONICAL;
    }
    return TransactionStatus.SUCCESS_ANCHOR_BLOCK;
  }
  if (tx?.tx_status === 'abort_by_response' || tx?.tx_status === 'abort_by_post_condition') {
    return TransactionStatus.FAILED;
  }
  if (
    tx?.tx_status === 'dropped_replace_across_fork' ||
    tx?.tx_status === 'dropped_replace_by_fee' ||
    tx?.tx_status === 'dropped_stale_garbage_collect' ||
    tx?.tx_status === 'dropped_too_expensive'
  ) {
    return TransactionStatus.DROPPED;
  }
}
