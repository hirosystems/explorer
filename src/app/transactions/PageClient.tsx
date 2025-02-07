'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFitlersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { isRedesignUrl } from '@/common/utils/url-utils';
import { TxListTabs } from '@/features/txs-list/tabs/TxListTabs';
import { Text } from '@/ui/Text';
import { ClientOnly, Flex, Stack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { PageTitle } from '../_components/PageTitle';
import { TxPageFilters } from './page';
import { MempoolFeeStatsSkeleton } from './skeleton';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({
  tokenPrice,
  filters,
}: {
  tokenPrice: TokenPrice;
  filters: TxPageFilters;
}) {
  const isRedesign = isRedesignUrl();

  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
      <TxListTabs filters={filters as Record<string, string | undefined>} />
      <ClientOnly>
        {isRedesign ? (
          <Stack gap={24} fontFamily="var(--font-instrument-sans)">
            {/* <Overview /> */}
            <Stack gap={8}>
              <Text textStyle="heading-md" color="textPrimary">
                Latest transactions
              </Text>
              <Stack gap={5}>
                <TxTableFilters filters={filters} />
                <TxsTable filters={filters} />
                <TxTableFiltersModal filters={filters} />
              </Stack>
            </Stack>
          </Stack>
        ) : null}
      </ClientOnly>
    </>
  );
}
