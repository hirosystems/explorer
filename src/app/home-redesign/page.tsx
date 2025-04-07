import { Flex, Stack } from '@chakra-ui/react';

import { NetworkOverview } from '../_components/NetworkOverview/NetworkOverview';
import { RecentBlocks } from '../_components/RecentBlocks/RecentBlocks';
import { StackingSection } from '../_components/StackingSection/StackingSection';
import { getCurrentStxPrice } from '../getTokenPriceInfo';
import { HomePageDataProvider } from './context';
import { fetchCurrentStackingCycle, fetchRecentBlocks } from './data';

export default async function HomeRedesign(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const api = searchParams?.api;
  const [stxPrice, recentBlocks, stackingCycle] = await Promise.all([
    getCurrentStxPrice(),
    fetchRecentBlocks(chain, api),
    fetchCurrentStackingCycle(chain, api),
  ]);
  return (
    <HomePageDataProvider
      stxPrice={stxPrice}
      initialRecentBlocks={recentBlocks}
      stackingCycle={stackingCycle}
    >
      <Stack gap={24}>
        <RecentBlocks />
        <Flex gap={[20, 20, 20, 2]} flexDirection={['column', 'column', 'column', 'row']}>
          <StackingSection />
          <NetworkOverview />
        </Flex>
      </Stack>
    </HomePageDataProvider>
  );
}
