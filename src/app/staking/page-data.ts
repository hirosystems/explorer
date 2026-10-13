import { fetchTx } from '@/api/data-fetchers';
import { isConfirmedTxDetails } from '@/app/txid/[txId]/tx-details-utils';
import { ensureError, logError } from '@/common/utils/error-utils';
import { getApiUrl } from '@/common/utils/network-utils';

import { fetchBond } from './data';

export async function fetchFeaturedBond(index: number, chain: string, api?: string) {
  const bond = await fetchBond(index, chain, api);
  if (!bond.transaction) return bond;

  try {
    // The bond endpoint can report the current burn height alongside the setup timestamp.
    // Read both from the confirmed setup transaction so the lifecycle stays chronological.
    const tx = await fetchTx(getApiUrl(chain, api), bond.transaction.tx_id, { redirect: 'error' });
    // The v3 endpoint only returns canonical mined transactions (or ones still in the mempool).
    if (!isConfirmedTxDetails(tx) || tx.bitcoin_block.height <= 0) {
      throw new Error('Bond setup transaction is not confirmed');
    }
    if (tx.status !== 'success') {
      throw new Error('Bond setup transaction failed');
    }
    return {
      ...bond,
      transaction: {
        ...bond.transaction,
        bitcoin_block: { height: tx.bitcoin_block.height, time: tx.bitcoin_block.time },
      },
    };
  } catch (error) {
    logError(
      ensureError(error),
      'Staking page: bond setup transaction unavailable',
      { index, chain },
      'error'
    );
    // Omit unverified setup metadata so the card falls back to its schedule estimate.
    return { ...bond, transaction: undefined };
  }
}
