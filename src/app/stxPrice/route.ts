import { NextRequest } from 'next/server';

import { LUNAR_CRUSH_API_KEY } from '../../common/constants/env';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const blockBurnTime = searchParams.get('blockBurnTime');

  try {
    if (!blockBurnTime || blockBurnTime === 'current') {
      const response = await fetch('https://lunarcrush.com/api4/public/coins/stx/v1', {
        next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
        headers: {
          Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Response.json({ price: data?.data?.price || 0 });
    }

    const toTime = new Date(blockBurnTime).getTime();
    const fromTime = toTime - (24 * 60 * 60 * 1000); // 1 day in milliseconds
    const response = await fetch(
      `https://lunarcrush.com/api4/public/coins/stx/time-series/v2?bucket=day&interval=1d&start=${
        fromTime / 1000
      }&end=${toTime / 1000}`,
      {
        next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
        headers: {
          Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json({ price: data?.data?.[0]?.open || 0 });
  } catch (error) {
    console.error('Error fetching STX price:', error);
    return Response.json({ price: 0 }, { status: 500 });
  }
}
