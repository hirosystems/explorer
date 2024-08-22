import dynamic from 'next/dynamic';

import { getTokenPrice } from '../getTokenPriceInfo';
import { SignersPageSkeleton } from '../signers/skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <SignersPageSkeleton />, // TODO: replace this
  ssr: false,
});

export default async function () {
  const tokenPrice = await getTokenPrice();
  return <Page tokenPrice={tokenPrice} />;
}
