'use client';

import { CompressedMempoolTxTableData } from '@/app/transactions/utils';
import { MempoolTable } from '@/common/components/table/table-examples/MempoolTable';
import {
  TxTableFiltersProvider,
  useTxTableFilters,
} from '@/common/components/table/tx-table/useTxTableFilters';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { Stack } from '@chakra-ui/react';

import { MempoolTableFilters } from './MempoolTableFilters';

interface MempoolTableWithFiltersContentProps {
  initialData?: GenericResponseType<CompressedMempoolTxTableData>;
}

function MempoolTableWithFiltersContent({ initialData }: MempoolTableWithFiltersContentProps) {
  const { fromAddress, toAddress, transactionType } = useTxTableFilters();

  return (
    <Stack gap={4}>
      <MempoolTableFilters />
      <MempoolTable
        filters={{
          fromAddress,
          toAddress,
          transactionType,
        }}
        initialData={initialData}
        disablePagination={true}
      />
    </Stack>
  );
}

export function MempoolTableWithFilters({
  initialData,
  searchParams,
}: {
  initialData?: GenericResponseType<CompressedMempoolTxTableData>;
  searchParams?: Record<string, string>;
}) {
  const defaultTransactionType = searchParams?.transactionType
    ? searchParams.transactionType.split(',')
    : [];
  const defaultFromAddress = searchParams?.fromAddress || '';
  const defaultToAddress = searchParams?.toAddress || '';
  const defaultStartTime = searchParams?.startTime || '';
  const defaultEndTime = searchParams?.endTime || '';

  return (
    <TxTableFiltersProvider
      defaultTransactionType={defaultTransactionType}
      defaultFromAddress={defaultFromAddress}
      defaultToAddress={defaultToAddress}
      defaultStartTime={defaultStartTime}
      defaultEndTime={defaultEndTime}
    >
      <MempoolTableWithFiltersContent initialData={initialData} />
    </TxTableFiltersProvider>
  );
}
