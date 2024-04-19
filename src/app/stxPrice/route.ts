import { NextRequest } from 'next/server';

import { LUNAR_CRUSH_API_KEY } from '../../common/constants/env';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const blockBurnTime = searchParams.get('blockBurnTime');

  if (!blockBurnTime || blockBurnTime === 'current') {
    const response = await fetch('https://lunarcrush.com/api4/public/coins/stx/v1', {
      headers: {
        Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
      },
    });
    const data = await response.json();
    return Response.json({ price: data?.data?.price || 0 });
  }

  const to = new Date(blockBurnTime);
  const from = new Date(blockBurnTime);
  from.setDate(from.getDate() - 1);
  const response = await fetch(
    `https://lunarcrush.com/api4/public/coins/stx/time-series/v2?bucket=day&interval=1d&start=${
      from.getTime() / 1000
    }&end=${to.getTime() / 1000}`,
    {
      next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
      headers: {
        Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
      },
    }
  );

  const data = await response.json();

  return Response.json({ price: data?.data?.[0]?.open || 0 });
}
