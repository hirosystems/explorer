import { Table } from '@/common/components/table/Table';
import { ColumnDef } from '@tanstack/react-table';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { formatFunctionResult } from './utils';

enum FunctionResultsTableColumns {
  Field = 'field',
  Value = 'value',
  Type = 'type',
}

interface FunctionResultsTableData {
  [FunctionResultsTableColumns.Field]: string;
  [FunctionResultsTableColumns.Value]: string;
  [FunctionResultsTableColumns.Type]: string;
}

const columnDefinitions: ColumnDef<FunctionResultsTableData>[] = [
  {
    id: FunctionResultsTableColumns.Field,
    header: 'Field',
    accessorKey: FunctionResultsTableColumns.Field,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
  {
    id: FunctionResultsTableColumns.Value,
    header: 'Value',
    accessorKey: FunctionResultsTableColumns.Value,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
  {
    id: FunctionResultsTableColumns.Type,
    header: 'Type',
    accessorKey: FunctionResultsTableColumns.Type,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
];

export interface FunctionResult {
  field: string;
  value: string;
  type: string;
}

export function FunctionResultsTable({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) {
  const result = formatFunctionResult(tx);
  console.log({result})
  return <Table columns={columnDefinitions} data={result} />;
}
