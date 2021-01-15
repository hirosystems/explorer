import type { NextApiRequest, NextApiResponse } from 'next';

export default async function v2Proxy({ query }: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const paths = Array.isArray(query?.paths) ? query?.paths?.join('/') : '';
    const response = await fetch(`http://seed-2.mainnet.stacks.co:20443/v2/${paths}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}
