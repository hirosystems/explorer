import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFromSidecar } from '@common/api/fetch';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

export async function fetchTxList(): Promise<{ results: Transaction[] }> {
  const resp = await fetchFromSidecar('/tx');
  console.log(resp);
  return resp.json();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tx = await fetchTxList();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(tx));
};
