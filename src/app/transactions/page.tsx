import dynamic from 'next/dynamic';
import * as React from 'react';

import { getTokenPrice } from '../getTokenPriceInfo';
import Skeleton from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Skeleton />,
  ssr: false,
});

export default async function () {
  const tokenPrice = await getTokenPrice();
  return <Page tokenPrice={tokenPrice} />;
}
