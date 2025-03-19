'use client';

import { TxTableFilters } from '@/common/components/table/TxTableFilters';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { isRedesignUrl } from '@/common/utils/url-utils';
import { TxListTabs } from '@/features/txs-list/tabs/TxListTabs';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { FilterProps } from '../search/filters';
import { MempoolFeeStatsSkeleton } from './skeleton';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({ tokenPrice, filters }: { tokenPrice: TokenPrice } & FilterProps) {
  const isRedesign = isRedesignUrl();

  // TODO: set filters in redux
  return (
    <>
      {/* <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex> */}
      {/* <MempoolFeeStatsDynamic tokenPrice={tokenPrice} /> */}
      {/* <TxListTabs filters={filters} /> */}
      <TxTableFilters filters={filters} />
      <TxsTable filters={filters} />
      {/* <ClientOnly>{isRedesign ? <TxsTable /> : null}</ClientOnly> */}
    </>
  );
}
