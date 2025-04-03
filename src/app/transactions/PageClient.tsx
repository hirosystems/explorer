'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFitlersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';

import { TokenPrice } from '../../common/types/tokenPrice';
import { TxPageFilters } from './page';
import { CompressedTxTableData } from './utils';

export default function ({
  tokenPrice,
  filters,
  initialTxTableData,
}: {
  tokenPrice: TokenPrice;
  filters: TxPageFilters;
  initialTxTableData: GenericResponseType<CompressedTxTableData>;
}) {
  return (
    <Stack gap={24} fontFamily="var(--font-instrument-sans)">
      {/* <Overview /> */}
      <Stack gap={8}>
        <Text textStyle="heading-md" color="textPrimary">
          Latest transactions
        </Text>
        <Stack gap={5}>
          <TxTableFilters filters={filters} />
          <TxsTable filters={filters} initialData={initialTxTableData} />
          <TxTableFiltersModal filters={filters} />
        </Stack>
      </Stack>
    </Stack>
  );

  // return (
  //   <>
  //     <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
  //       <PageTitle>Transactions</PageTitle>
  //     </Flex>
  //     <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
  //     <TxListTabs filters={filters as Record<string, string | undefined>} />
  //     <ClientOnly>
  //       {isRedesign ? (
  //         <Stack gap={24} fontFamily="var(--font-instrument-sans)">
  //           {/* <Overview /> */}
  //           <Stack gap={8}>
  //             <Text textStyle="heading-md" color="textPrimary">
  //               Latest transactions
  //             </Text>
  //             <Stack gap={5}>
  //               <TxTableFilters filters={filters} />
  //               <TxsTable filters={filters} initialData={initialTxTableData} />
  //               <TxTableFiltersModal filters={filters} />
  //             </Stack>
  //           </Stack>
  //         </Stack>
  //       ) : null}
  //     </ClientOnly>
  //   </>
  // );
}
