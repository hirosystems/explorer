import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFromRootApi } from '@common/api/fetch';
import { Contract } from '@models/contract.interface';

async function fetchContract(contract_id: string): Promise<Contract> {
  const resp = await fetchFromRootApi(`/contract/${contract_id}`);
  return resp.json();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { contract_id },
  } = req;
  const contract = await fetchContract(contract_id as string);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(contract));
};
