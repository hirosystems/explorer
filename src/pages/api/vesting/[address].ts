import type { NextApiRequest, NextApiResponse } from 'next';
import { addressConvert } from '@common/utils/addresses';

function makeUrl(path: string) {
  const root =
    process.env.DEPLOYMENT_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000';
  return `${root}${path}`;
}

export default async function vestingAddressHandler(
  { query: { address } }: NextApiRequest,
  res: NextApiResponse<{ found: boolean } | { error: string }>
) {
  try {
    if (address && typeof address === 'string') {
      const result = addressConvert(address);
      const response = await fetch(makeUrl('/api/addresses'));
      const addresses: string[] = await response.json();
      const found = addresses.find(item => item === (result.mainnet.BTC || result.mainnet.STACKS));
      if (!!found) {
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
