'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFitlersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { isRedesignUrl } from '@/common/utils/url-utils';
import { TxListTabs } from '@/features/txs-list/tabs/TxListTabs';
import { ClientOnly, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { PageTitle } from '../_components/PageTitle';
import { CompressedTxTableData, TxPageFilters } from './page';
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
  initialTxTableData,
}: {
  tokenPrice: TokenPrice;
  filters: TxPageFilters;
  initialTxTableData: GenericResponseType<CompressedTxTableData>;
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
          <>
            <TxTableFilters filters={filters} />
            <TxsTable filters={filters} initialData={initialTxTableData} />
            <TxTableFiltersModal filters={filters} />
          </>
        ) : null}
      </ClientOnly>
    </>
  );
}
