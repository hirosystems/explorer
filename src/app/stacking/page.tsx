import { Box } from '@/ui/Box';
import dynamic from 'next/dynamic';

import { getTokenPrice } from '../getTokenPriceInfo';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Box>Loading...</Box>, // TODO: replace this
  ssr: false,
});

export default async function () {
  const tokenPrice = await getTokenPrice();
  return <Page tokenPrice={tokenPrice} />;
}
