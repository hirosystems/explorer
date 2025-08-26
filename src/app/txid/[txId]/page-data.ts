import { stacksAPIFetch } from '@/api/stacksAPIFetch';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export const getTxTag = (txId: string) => `tx-id-${txId}`;
const CONFIRMED_TX_REVALIDATION_TIMEOUT_IN_SECONDS = 3; // 3 seconds

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
