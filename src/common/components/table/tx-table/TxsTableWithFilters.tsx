import { CompressedTxTableData } from '@/app/transactions/utils';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';

import { useTxTableFilters } from './useTxTableFilters';

export function TxsTableWithFilters({
  initialData,
}: {
  initialData: GenericResponseType<CompressedTxTableData> | undefined;
}) {
  const { fromAddress, toAddress, startTime, endTime, transactionType } = useTxTableFilters();
  return (
    <TxsTable
      initialData={initialData}
      filters={{ fromAddress, toAddress, startTime, endTime, transactionType }}
    />
  );
}
