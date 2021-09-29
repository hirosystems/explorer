import React, { useEffect, useState } from 'react';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { TxStatus } from '@common/types/tx';
import { TransactionStatus } from '@common/constants';

export const useTransactionStatus = (
  tx: Transaction | MempoolTransaction | undefined
): TxStatus | undefined => {
  const [txStatus, setTxStatus] = useState<TxStatus>();

  // Used to construct tx status feedback in the UI
  useEffect(() => {
    if (tx?.tx_status === 'pending') {
      setTxStatus(TransactionStatus.PENDING);
    } else if (tx?.tx_status === 'success' && !!tx.is_unanchored) {
      setTxStatus(TransactionStatus.SUCCESS_MICROBLOCK);
    } else if (tx?.tx_status === 'success' && !tx.is_unanchored) {
      if (!tx.microblock_canonical) {
        setTxStatus(TransactionStatus.FAILED);
      } else {
        setTxStatus(TransactionStatus.SUCCESS_ANCHOR_BLOCK);
      }
    } else if (
      tx?.tx_status === 'abort_by_response' ||
      tx?.tx_status === 'abort_by_post_condition'
    ) {
      setTxStatus(TransactionStatus.FAILED);
    } else {
      setTxStatus(undefined);
    }
  });

  return txStatus;
};
