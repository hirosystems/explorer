import dynamic from 'next/dynamic';

import Skeleton from './skeleton';
import { getTokenPrice } from '../getTokenPriceInfo';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Skeleton />,
  ssr: false,
});

export default async function () {
  const tokenPrice = await getTokenPrice();
  return <Page tokenPrice={tokenPrice} />;
}
