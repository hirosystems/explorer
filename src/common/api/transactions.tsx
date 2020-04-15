import fetch from 'isomorphic-unfetch';
import { Transaction } from '@models/transaction.interface';

export async function fetchTx({ txid }: { txid: string }): Promise<Transaction> {
  const resp = await fetch(process.env.API_SERVER + '/tx/' + txid);
  return await resp.json();
}

export async function fetchTxList(): Promise<{ results: Transaction[] }> {
  const resp = await fetch(process.env.API_SERVER + '/tx');
  return await resp.json();
}
