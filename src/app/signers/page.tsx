import dynamic from 'next/dynamic';

import { getTokenPrice } from '../getTokenPriceInfo';
import { SignersPageSkeleton } from './skeleton';
import Page from './PageClient';
// const Page = dynamic(() => import('./PageClient'), {
//   loading: () => <SignersPageSkeleton />,
// });

export default async function () {
  // const tokenPrice = await getTokenPrice();
  // return <Page tokenPrice={tokenPrice} />;
  return <Page tokenPrice={{
    btcPrice: 0,
    stxPrice: 0
  }} />;
}
