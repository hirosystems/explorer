import type { NextApiRequest, NextApiResponse } from 'next';
import { getPoxAddrForRewardCycle } from '@common/api/pox-helpers';

export default async function poxHandler(
  { query: { cycle } }: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const data = await getPoxAddrForRewardCycle(1);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}
