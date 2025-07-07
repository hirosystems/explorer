import { FeeSection } from '@/app/_components/FeeSection';
import { MempoolSection } from '@/app/_components/MempoolSection';
import { getSampleTxsFeeEstimate } from '@/common/utils/fee-utils';
import { Flex, Stack } from '@chakra-ui/react';

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

export default async function HomeRedesign(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const api = searchParams?.api;
  const isSSRDisabled = searchParams?.ssr === 'false';

  const stacksAPIRequests = isSSRDisabled
    ? []
    : ([
        fetchRecentBlocks(chain, api),
        fetchCurrentStackingCycle(chain, api),
        fetchRecentUITxs(chain, api),
        fetchUIMempoolStats(chain, api),
        getSampleTxsFeeEstimate(chain as 'mainnet' | 'testnet', api),
      ] as const);

  const stacksAPIResults = await Promise.all(stacksAPIRequests);

  const [recentBlocks, stackingCycle, initialTxTableData, mempoolStats, sampleTxsFeeEstimate] =
    isSSRDisabled
      ? ([undefined, undefined, undefined, undefined, undefined] as const)
      : stacksAPIResults;

  const feeEstimates = sampleTxsFeeEstimate
    ? {
        tokenTransferFees: sampleTxsFeeEstimate.tokenTransferFees,
        contractCallFees: sampleTxsFeeEstimate.contractCallFees,
        contractDeployFees: sampleTxsFeeEstimate.contractDeployFees,
        averageFees: sampleTxsFeeEstimate.averageFees,
      }
    : undefined;
  return (
    <HomePageDataProvider
      initialRecentBlocks={recentBlocks}
      stackingCycle={stackingCycle}
      mempoolStats={mempoolStats}
      feeEstimates={feeEstimates}
      isSSRDisabled={isSSRDisabled}
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
          <FeeSection />
          </Flex>
        </Flex>
      </Stack>
    </HomePageDataProvider>
  );
}
