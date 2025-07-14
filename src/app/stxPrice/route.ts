import { NextRequest } from 'next/server';

import { LUNAR_CRUSH_API_KEY } from '../../common/constants/env';

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  const nodeEnv = process.env.NODE_ENV || 'unknown';
  const searchParams = request.nextUrl.searchParams;
  const blockBurnTime = searchParams.get('blockBurnTime');

  console.log(`🚨 STX Price API called at ${timestamp}`);
  console.log(`   Environment: NODE_ENV=${nodeEnv}`);
  console.log(
    `   Request type: ${!blockBurnTime || blockBurnTime === 'current' ? 'CURRENT' : 'HISTORICAL'}`
  );
  console.log(`   Cache expected: ${nodeEnv === 'production' ? 'YES' : 'NO (not production)'}`);

  try {
    if (!blockBurnTime || blockBurnTime === 'current') {
    console.log(`   📡 Fetching CURRENT STX price from LunarCrush`);
    console.log(`   ⏱️ Cache config: revalidate=600s (10 minutes)`);

    const startTime = Date.now();
    const response = await fetch('https://lunarcrush.com/api4/public/coins/stx/v1', {
      next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
      headers: {
        Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
      },
    });

    const duration = Date.now() - startTime;
    console.log(`   ✅ Current price response in ${duration}ms`);
    console.log(
      `   ${duration < 100 ? '🟢 FAST (likely cached)' : '🟡 SLOW (likely fresh fetch)'}`
    );

    const data = await response.json();
    
    // Debug the API response structure
    console.log(`   📊 Current price API structure:`, {
      hasData: !!data,
      hasDataProperty: !!data?.data,
      hasPriceProperty: !!data?.data?.price,
      priceValue: data?.data?.price
    });

    const price = data?.data?.price || 0;
    console.log(`   💰 Current price extracted: ${price}`);
    
          return Response.json({ price });
    }

    console.log(`   📡 Fetching HISTORICAL STX price for: ${blockBurnTime}`);
  console.log(`   ⏱️ Cache config: revalidate=600s (10 minutes)`);

  const to = new Date(blockBurnTime);
  const from = new Date(blockBurnTime);
  from.setDate(from.getDate() - 1);

  const startTime = Date.now();
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

  const duration = Date.now() - startTime;
  console.log(`   ✅ Historical price response in ${duration}ms`);
  console.log(`   ${duration < 100 ? '🟢 FAST (likely cached)' : '🟡 SLOW (likely fresh fetch)'}`);

  const data = await response.json();
  
  // Debug the API response structure
  console.log(`   📊 API Response structure:`, {
    hasData: !!data,
    hasDataProperty: !!data?.data,
    dataType: Array.isArray(data?.data) ? 'array' : typeof data?.data,
    dataLength: Array.isArray(data?.data) ? data.data.length : 'not-array',
    firstItem: Array.isArray(data?.data) && data.data.length > 0 ? 'exists' : 'missing'
  });

  // Safe access to historical price data
  let price = 0;
  if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
    price = data.data[0]?.open || 0;
    console.log(`   💰 Extracted price: ${price}`);
  } else {
    console.log(`   ⚠️ No valid price data found in response`);
  }

  return Response.json({ price });
  
  } catch (error) {
    console.log(`   ❌ STX Price API Error:`, error);
    console.log(`   🔄 Returning fallback price: 0`);
    return Response.json({ price: 0 }, { status: 500 });
  }
}
