import { TokenPrice } from '../common/types/tokenPrice';
import { getCacheClient } from '../common/utils/cache-client';

const TOKEN_PRICE_CACHE_KEY = 'token-price';

export const getCurrentBtcPrice = async () =>
  fetch('https://api.coingecko.com/api/v3/exchange_rates')
    .then(res => res.json())
    .then(data => data?.rates?.usd?.value || 0);

export const getCurrentStxPrice = async () =>
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack,bitcoin&vs_currencies=usd')
    .then(res => res.json())
    .then(data => data?.blockstack?.usd || 0);

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
