import { Table } from '@/common/components/table/Table';
import { ColumnDef } from '@tanstack/react-table';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { formatFunctionResult } from './utils';

enum FunctionResultsTableColumns {
  Name = 'name',
  Value = 'value',
  Type = 'type',
}

interface FunctionResultsTableData {
  [FunctionResultsTableColumns.Name]: string;
  [FunctionResultsTableColumns.Value]: string;
  [FunctionResultsTableColumns.Type]: string;
}

const columnDefinitions: ColumnDef<FunctionResultsTableData>[] = [
  {
    id: FunctionResultsTableColumns.Name,
    header: 'Name',
    accessorKey: FunctionResultsTableColumns.Name,
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
  name: string;
  value: string;
  type: string;
}

export function FunctionResultsTable({ tx }: { tx: ContractCallTransaction }) {
  const result = tx.tx_result;
  console.log('FunctionResultsTable', { result });
  const formattedResult = formatFunctionResult(result);
  console.log('FunctionResultsTable', { formattedResult });
  return <Table columns={columnDefinitions} data={formattedResult} />;
}
