'use client';

import { TxTableFilters } from '@/common/components/table/TxTableFilters';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { isRedesignUrl } from '@/common/utils/url-utils';
import { TxListTabs } from '@/features/txs-list/tabs/TxListTabs';
import { ClientOnly, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { PageTitle } from '../_components/PageTitle';
import { FilterProps } from '../search/filters';
import { MempoolFeeStatsSkeleton } from './skeleton';
import { TxTableFiltersModal } from '@/common/components/table/TxTableFitlersModal';
import { TxPageFilters } from './page';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({ tokenPrice, filters }: { tokenPrice: TokenPrice, filters: TxPageFilters }) {
  const isRedesign = isRedesignUrl();

  return (
    <>
      {/* <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
      <TxListTabs filters={filters} /> */}
      <TxTableFilters filters={filters} />
      <TxsTable filters={filters} />
      {/* <ClientOnly>
        {isRedesign ? (
          <>
            <TxTableFilters filters={filters} />
            <TxsTable filters={filters} />
          </>
        ) : null}
      </ClientOnly> */}
      <TxTableFiltersModal
      filters={filters}
      />
    </>
  );
}
