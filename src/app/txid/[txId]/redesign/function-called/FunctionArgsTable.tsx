import { Table } from '@/common/components/table/Table';
import { microToStacksFormatted } from '@/common/utils/utils';
import { ColumnDef } from '@tanstack/react-table';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';
import { formatFunctionArgs } from './utils';

enum FunctionArgsTableColumns {
  Name = 'name',
  Value = 'value',
  Type = 'type',
}

interface FunctionArgsTableData {
  [FunctionArgsTableColumns.Name]: string;
  [FunctionArgsTableColumns.Value]: string;
  [FunctionArgsTableColumns.Type]: string;
}

const columnDefinitions: ColumnDef<FunctionArgsTableData>[] = [
  {
    id: FunctionArgsTableColumns.Name,
    header: 'Name',
    accessorKey: FunctionArgsTableColumns.Name,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
  {
    id: FunctionArgsTableColumns.Value,
    header: 'Value',
    accessorKey: FunctionArgsTableColumns.Value,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
  {
    id: FunctionArgsTableColumns.Type,
    header: 'Type',
    accessorKey: FunctionArgsTableColumns.Type,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
];

export interface FunctionArg {
  name: string;
  value: string;
  type: string;
}

export function FunctionArgsTable({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) {
  const args = formatFunctionArgs(tx);
  return <Table columns={columnDefinitions} data={args} />;
}
