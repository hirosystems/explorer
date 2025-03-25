'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFitlersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { isRedesignUrl } from '@/common/utils/url-utils';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { CompressedTxTableData, TxPageFilters } from './page';
import { MempoolFeeStatsSkeleton } from './skeleton';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';

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
  txTableData,
}: {
  tokenPrice: TokenPrice;
  filters: TxPageFilters;
  txTableData: GenericResponseType<CompressedTxTableData>;
}) {
  const isRedesign = isRedesignUrl();
  console.log({ txTableData });

  return (
    <>
      {/* <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
      <TxListTabs filters={filters as Record<string, string | undefined>} />
      <ClientOnly>
        {isRedesign ? (
          <>
            <TxTableFilters filters={filters} />
            <TxsTable filters={filters} />
            <TxTableFiltersModal filters={filters} />
          </>
        ) : null}
      </ClientOnly> */}
      <TxTableFilters filters={filters} />
      <TxsTable filters={filters} initialData={txTableData} />
      <TxTableFiltersModal filters={filters} />
    </>
  );
}
