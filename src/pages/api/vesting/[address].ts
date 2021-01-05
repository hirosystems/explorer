import type { NextApiRequest, NextApiResponse } from 'next';
import DATA from './data.json';
import { addressConvert } from '@common/utils/addresses';

const addresses = new Set(DATA);

export default async function vestingAddressHandler(
  { query: { address } }: NextApiRequest,
  res: NextApiResponse<{ found: boolean } | { error: string }>
) {
  try {
    if (address && typeof address === 'string') {
      const result = addressConvert(address);
      const found = addresses.has(result.mainnet.BTC || result.mainnet.STACKS);
      if (found) {
        res.status(200).json({ found: true });
      } else {
        res.status(404).json({ found: false });
      }
    } else {
      res.status(404).json({ found: false });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}
