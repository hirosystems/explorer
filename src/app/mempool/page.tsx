import { getTokenPrice } from '../getTokenPriceInfo';
import Page from './PageClient';

export default async function () {
  const tokenPrice = await getTokenPrice();

  return <Page tokenPrice={tokenPrice} />;
}
