import dynamic from 'next/dynamic';

import { getTokenPrice } from '../getTokenPriceInfo';
import { SignersPageSkeleton } from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <SignersPageSkeleton />,
});

export default async function () {
  const tokenPrice = await getTokenPrice();
  return <Page tokenPrice={tokenPrice} />;
}
