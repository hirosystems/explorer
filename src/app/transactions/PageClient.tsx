'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFiltersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';

import { TxPageFilters } from './page';
import { CompressedTxTableData } from './utils';

export default function ({
  filters,
  initialTxTableData,
}: {
  filters: TxPageFilters;
  initialTxTableData: GenericResponseType<CompressedTxTableData> | undefined;
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
}
