import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFromRootApi } from '@common/api/fetch';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

async function fetchTx(txid: Transaction['tx_id']): Promise<Transaction> {
  const resp = await fetchFromRootApi(`/tx/${txid}`);
  return resp.json();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { txid },
  } = req;
  const tx = await fetchTx(txid as string);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(tx));
};
