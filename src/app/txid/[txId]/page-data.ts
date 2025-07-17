import { revalidatePath } from 'next/cache';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

const getTxTag = (txId: string) => `tx-id-${txId}`;
const PENDING_TX_REVALIDATION_INTERVAL = 7; // 7 seconds
const CONFIRMED_TX_REVALIDATION_TIMEOUT = 600; // 10 minutes

export async function fetchTxById(
  apiUrl: string,
  txId: string
): Promise<Transaction | MempoolTransaction> {
  const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`, {
    cache: 'default',
    next: {
      revalidate: CONFIRMED_TX_REVALIDATION_TIMEOUT,
      tags: [getTxTag(txId)],
    },
    headers: {
      'x-api-key': '',
    },
  });
  const tx: Transaction | MempoolTransaction = await response.json();
  console.log('fetched tx', {
    tx_id: tx.tx_id,
    tx_status: tx.tx_status,
    tx_type: tx.tx_type,
    response: {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: response.headers,
    },
  });
  const txStatus = tx.tx_status;
  if (txStatus === 'pending') {
    setTimeout(() => revalidatePath(getTxTag(txId), 'page'), PENDING_TX_REVALIDATION_INTERVAL); // Revalidate a dynamic page
  }
  return tx;
}
