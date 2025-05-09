import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { TxTableColumns } from '@/common/components/table/table-examples/types';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';

import { FeeSection } from './_components/FeeSection';
import { MempoolSection } from './_components/MempoolSection';
import { NetworkOverview } from './_components/NetworkOverview/NetworkOverview';
import { RecentBlocks } from './_components/RecentBlocks/RecentBlocks';
import { StackingSection } from './_components/StackingSection/StackingSection';
import { TXS_LIST_SIZE } from './consts';
import { HomePageDataProvider } from './context';
import {
  fetchCurrentStackingCycle,
  fetchMempoolFee,
  fetchRecentBlocks,
  fetchRecentUITxs,
  fetchUIMempoolStats,
} from './data';
import { getCurrentStxPrice } from './getTokenPriceInfo';

export default async function HomeRedesign(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const api = searchParams?.api;
  const [stxPrice, recentBlocks, stackingCycle, initialTxTableData, mempoolStats, mempoolFee] =
    await Promise.all([
      getCurrentStxPrice(),
      fetchRecentBlocks(chain, api),
      fetchCurrentStackingCycle(chain, api),
      fetchRecentUITxs(chain, api),
      fetchUIMempoolStats(chain, api),
      fetchMempoolFee(chain, api),
    ]);
  return (
    <HomePageDataProvider
      stxPrice={stxPrice}
      initialRecentBlocks={recentBlocks}
      stackingCycle={stackingCycle}
      mempoolStats={mempoolStats}
      mempoolFee={mempoolFee}
    >
      <Stack gap={[16, 18, 20, 24]}>
        <RecentBlocks />
        <Flex gap={[20, 20, 20, 2]} flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <StackingSection />
          <NetworkOverview />
        </Flex>
        <Flex gap={[20, 20, 20, 2]} flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Stack gap={4} flex={1} maxWidth={['100%', '100%', '100%', '100%', '50%']}>
            <Text whiteSpace={'nowrap'} textStyle="heading-md" color="textPrimary">
              Latest transactions
            </Text>
            <TxsTable
              filters={{}}
              initialData={initialTxTableData}
              disablePagination
              pageSize={TXS_LIST_SIZE}
              displayColumns={[
                TxTableColumns.Transaction,
                TxTableColumns.TxType,
                TxTableColumns.TxId,
                TxTableColumns.From,
                TxTableColumns.BlockTime,
              ]}
            />
          </Stack>
          <Flex gap={4} flexDirection={['column', 'column', 'column', 'column', 'column']} flex={1}>
            <MempoolSection />
            <FeeSection />
          </Flex>
        </Flex>
      </Stack>
    </HomePageDataProvider>
  );
}
