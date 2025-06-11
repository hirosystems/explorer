import { getSampleTxsFeeEstimate } from '@/common/utils/fee-utils';
import { Flex, Stack } from '@chakra-ui/react';
import { generateStacksUnsignedTransaction } from '@leather.io/stacks';

import { FeeSection } from './_components/FeeSection';
import { MempoolSection } from './_components/MempoolSection';
import { NetworkOverview } from './_components/NetworkOverview/NetworkOverview';
import { RecentBlocksSection } from './_components/RecentBlocks/RecentBlocks';
import { StackingSection } from './_components/StackingSection/StackingSection';
import { TxsSection } from './_components/TxsSection';
import { HomePageDataProvider } from './context';
import {
  fetchCurrentStackingCycle,
  fetchRecentBlocks,
  fetchRecentUITxs,
  fetchUIMempoolStats,
} from './data';
import { getCurrentStxPrice, getTokenPrice } from './getTokenPriceInfo';

export default async function HomeRedesign(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const api = searchParams?.api;
  const tokenPrice = await getTokenPrice();
  const [
    stxPrice,
    recentBlocks,
    stackingCycle,
    initialTxTableData,
    mempoolStats,
    sampleTxsFeeEstimate,
  ] = await Promise.all([
    getCurrentStxPrice(),
    fetchRecentBlocks(chain, api),
    fetchCurrentStackingCycle(chain, api),
    fetchRecentUITxs(chain, api),
    fetchUIMempoolStats(chain, api),
    getSampleTxsFeeEstimate(chain as 'mainnet' | 'testnet', api),
  ]);

  const { tokenTransferFees, contractCallFees, contractDeployFees, averageFees } =
    sampleTxsFeeEstimate;

  return (
    <HomePageDataProvider
      stxPrice={stxPrice}
      initialRecentBlocks={recentBlocks}
      stackingCycle={stackingCycle}
      mempoolStats={mempoolStats}
      feeEstimates={{
        tokenTransferFees,
        contractCallFees,
        contractDeployFees,
        averageFees,
      }}
    >
      <Stack gap={[16, 18, 20, 24]}>
        <RecentBlocksSection />
        <Flex gap={[20, 20, 20, 2]} flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <StackingSection />
          <NetworkOverview />
        </Flex>
        <Flex gap={[20, 20, 20, 2]} flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <TxsSection initialTxTableData={initialTxTableData} />
          <Flex gap={4} flexDirection={['column', 'column', 'column', 'column', 'column']} flex={1}>
            <MempoolSection />
            <FeeSection tokenPrice={tokenPrice} />
          </Flex>
        </Flex>
      </Stack>
    </HomePageDataProvider>
  );
}
