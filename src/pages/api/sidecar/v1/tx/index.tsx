import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFromRootApi } from '@common/api/fetch';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

export async function fetchTxList(): Promise<{ results: Transaction[] }> {
  const resp = await fetchFromRootApi('/sidecar/v1/tx');
  console.log(resp)
  return resp.json();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tx = await fetchTxList();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(tx));
};
