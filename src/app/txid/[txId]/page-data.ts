import { revalidatePath } from 'next/cache';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

const getTxTag = (txId: string) => `tx-id-${txId}`;
const PENDING_TX_REVALIDATION_INTERVAL = 7; // 7 seconds
const CONFIRMED_TX_REVALIDATION_TIMEOUT = 600; // 10 minutes

export async function fetchTxById(apiUrl: string, txId: string): Promise<Transaction | MempoolTransaction> {
  const fetchUrl = `${apiUrl}/extended/v1/tx/${txId}`;
  console.log({ fetchUrl });
  const response = await fetch(fetchUrl, {
    cache: 'default',
    next: {
      revalidate: CONFIRMED_TX_REVALIDATION_TIMEOUT,
      tags: [getTxTag(txId)],
    },
  });
  const tx: Transaction | MempoolTransaction = await response.json();
  const txStatus = tx.tx_status;
  if (txStatus === 'pending') {
    setTimeout(() => revalidatePath(getTxTag(txId), 'page'), PENDING_TX_REVALIDATION_INTERVAL); // Revalidate a dynamic page
  }
  return tx;
}

export function compressTx(tx: Transaction | MempoolTransaction) {
  return {
    ...tx,
    // ...compressTransactions([tx])[0],
  };
}
