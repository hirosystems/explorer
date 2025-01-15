import dynamic from 'next/dynamic';

import { getTokenPrice } from '../getTokenPriceInfo';
import { SignersPageSkeleton } from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <SignersPageSkeleton />,
  ssr: false,
});

export default async function () {
  // const tokenPrice = await getTokenPrice();
  return (
    <Page
      tokenPrice={{
        stxPrice: 123,
        btcPrice: 123,
      }}
    />
  );
}
