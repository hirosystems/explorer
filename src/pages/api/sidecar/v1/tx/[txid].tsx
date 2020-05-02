import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFromRootApi } from '@common/api/fetch';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

async function fetchTx(txid: Transaction['tx_id']): Promise<Transaction> {
  const resp = await fetchFromRootApi(`/sidecar/v1/tx/${txid}`);
  if (resp.status === 404) {
    throw Error('Sorry, transaction not found!');
  }
  if (resp.status === 500) {
    throw Error('Something went wrong!');
  }
  return resp.json();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { txid },
  } = req;

  try {
    const tx = await fetchTx(txid as string);
    console.log(tx);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tx));
  } catch (e) {
    res.statusCode = 404;
    res.end(e.message);
    return;
  }
};
