import { stacksAPIFetch } from '@/api/stacksAPIFetch';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export const getTxTag = (txId: string) => `tx-id-${txId}`;
const PENDING_TX_REVALIDATION_INTERVAL_IN_MS = 7 * 1000; // 7 seconds
const CONFIRMED_TX_REVALIDATION_TIMEOUT_IN_SECONDS = 600; // 10 minutes

export async function fetchTxById(
  apiUrl: string,
  txId: string
): Promise<Transaction | MempoolTransaction> {
  const response = await stacksAPIFetch(`${apiUrl}/extended/v1/tx/${txId}`, {
    cache: 'default',
    next: {
      revalidate: CONFIRMED_TX_REVALIDATION_TIMEOUT_IN_SECONDS,
      tags: [getTxTag(txId)],
    },
  });

  const tx: Transaction | MempoolTransaction = await response.json();
  return tx;
}
