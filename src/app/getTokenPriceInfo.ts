import { LUNAR_CRUSH_API_KEY } from '../common/constants/env';
import { TokenPrice } from '../common/types/tokenPrice';

export const getCurrentBtcPrice = async (): Promise<number> =>
  fetch('https://lunarcrush.com/api4/public/coins/btc/v1', {
    cache: 'default',
    next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
    headers: {
      Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
    },
  })
    .then(res => {
      return res.json();
    })
    .then(data => data?.data?.price || 0);

export const getCurrentStxPrice = async (): Promise<number> =>
  fetch('https://lunarcrush.com/api4/public/coins/830/v1', {
    cache: 'default',
    next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
    headers: {
      Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
    },
  })
    .then(res => {
      return res.json();
    })
    .then(data => data?.data?.price || 0);

export async function getTokenPrice(): Promise<TokenPrice> {
  console.log('[debug] fetching token price');

  const btcPrice = await getCurrentBtcPrice();
  const stxPrice = await getCurrentStxPrice();

  const tokenPrice = {
    btcPrice,
    stxPrice,
  };

  return tokenPrice;
}
