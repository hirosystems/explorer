import { Transaction } from '@models/transaction.interface';
import { fetchFromSidecar } from '@common/api/fetch';

export const fetchTx = (apiServer: string) => async (
  txid: Transaction['tx_id']
): Promise<Transaction> => {
  const resp = await fetchFromSidecar(apiServer)(`/tx/${txid}`);

  const tx = await resp.json();
  if (!resp.ok) {
    throw Error(tx.error);
  }

  return tx;
};

export const fetchTxList = (apiServer: string) => async (): Promise<{ results: Transaction[] }> => {
  const resp = await fetchFromSidecar(apiServer)('/tx?limit=200');
  return resp.json();
};
