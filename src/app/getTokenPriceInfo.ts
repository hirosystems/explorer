import { LUNAR_CRUSH_API_KEY } from '../common/constants/env';
import { TokenPrice } from '../common/types/tokenPrice';
import { getCacheClient } from '../common/utils/cache-client';

const TOKEN_PRICE_CACHE_KEY = 'token-price';

export const getCurrentBtcPrice = async (): Promise<number> =>
  fetch('https://lunarcrush.com/api4/public/coins/btc/v1', {
    next: { revalidate: 10 * 60 }, // Revalidate every 10
    headers: {
      Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
    },
  })
    .then(res => res.json())
    .then(data => data?.data?.price || 0);

export const getCurrentStxPrice = async (): Promise<number> =>
  fetch('https://lunarcrush.com/api4/public/coins/830/v1', {
    next: { revalidate: 10 * 60 }, // Revalidate every 10
    headers: {
      Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
    },
  })
    .then(res => res.json())
    .then(data => data?.data?.price || 0);

async function getCachedTokenPrice() {
  try {
    const cachedTokenPrice = await getCacheClient().get(TOKEN_PRICE_CACHE_KEY);
    if (cachedTokenPrice) {
      return JSON.parse(cachedTokenPrice);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getTokenPrice(): Promise<TokenPrice> {
  const cachedTokenInfo = await getCachedTokenPrice();
  if (cachedTokenInfo) {
    console.log('[debug] token price - cache hit');
    return cachedTokenInfo;
  }

  console.log('[debug] token price - cache miss');

  const btcPrice = await getCurrentBtcPrice();
  const stxPrice = await getCurrentStxPrice();

  const tokenPrice = {
    btcPrice,
    stxPrice,
  };

  await getCacheClient().set(TOKEN_PRICE_CACHE_KEY, JSON.stringify(tokenPrice), 'EX', 60 * 3); // expires in 3 minutes
  return tokenPrice;
}
