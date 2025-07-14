import { LUNAR_CRUSH_API_KEY } from '../common/constants/env';
import { TokenPrice } from '../common/types/tokenPrice';

export const getCurrentBtcPrice = async (): Promise<number> => {
  console.log('[debug] getCurrentBtcPrice started');
  console.log('[debug] LUNAR_CRUSH_API_KEY exists:', !!LUNAR_CRUSH_API_KEY);

  const url = 'https://lunarcrush.com/api4/public/coins/btc/v1';
  try {
    const response = await fetch(url, {
      cache: 'default',
      next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
      headers: {
        Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
      },
    });

    console.log('[debug] BTC fetch response status:', response.status, response.ok);

    const data = await response.json();
    const price = data?.data?.price || 0;
    console.log('[debug] BTC price extracted:', price, 'from data.data.price');

    return price;
  } catch (error) {
    console.error('[debug] getCurrentBtcPrice error for URL:', url, error);
    return 0;
  }
};

export const getCurrentStxPrice = async (): Promise<number> => {
  console.log('[debug] getCurrentStxPrice started');

  const url = 'https://lunarcrush.com/api4/public/coins/830/v1';
  try {
    const response = await fetch(url, {
      cache: 'default',
      next: { revalidate: 10 * 60 }, // Revalidate every 10 minutes
      headers: {
        Authorization: `Bearer ${LUNAR_CRUSH_API_KEY}`,
      },
    });

    console.log('[debug] STX fetch response status:', response.status, response.ok);

    const data = await response.json();
    const price = data?.data?.price || 0;
    console.log('[debug] STX price extracted:', price, 'from data.data.price');

    return price;
  } catch (error) {
    console.error('[debug] getCurrentStxPrice error for URL:', url, error);
    return 0;
  }
};

export async function getTokenPrice(): Promise<TokenPrice> {
  console.log('[debug] getTokenPrice started');

  try {
    const btcPrice = await getCurrentBtcPrice();
    console.log('[debug] BTC price result:', btcPrice);

    const stxPrice = await getCurrentStxPrice();
    console.log('[debug] STX price result:', stxPrice);

    const tokenPrice = {
      btcPrice,
      stxPrice,
    };

    console.log('[debug] final token price object:', tokenPrice);
    return tokenPrice;
  } catch (error) {
    console.error('[debug] getTokenPrice error during token price fetch:', error);
    throw error;
  }
}
