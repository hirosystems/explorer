import { Transaction } from '@models/transaction.interface';
import { fetchFromApi } from '@common/api/fetch';

export async function fetchTx(txid: Transaction['tx_id']): Promise<Transaction> {
  const resp = await fetchFromApi(`/sidecar/v1/tx/${txid}`);
  return resp.json();
}

export async function fetchTxList(): Promise<{ results: Transaction[] }> {
  const resp = await fetchFromApi('/sidecar/v1/tx');
  return resp.json();
}
