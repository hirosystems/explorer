import { Transaction } from '@models/transaction.interface';
import { fetchFromSidecar } from '@common/api/fetch';

export async function fetchTx(txid: Transaction['tx_id']): Promise<Transaction> {
  const resp = await fetchFromSidecar(`/tx/${txid}`);

  const tx = await resp.json();
  console.log(tx);
  if (!resp.ok) {
    throw Error(tx.error);
  }

  return tx;
}

export async function fetchTxList(): Promise<{ results: Transaction[] }> {
  const resp = await fetchFromSidecar('/tx');
  return resp.json();
}
