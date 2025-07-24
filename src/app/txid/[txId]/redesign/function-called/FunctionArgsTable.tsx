import { Table } from '@/common/components/table/Table';
import { ColumnDef } from '@tanstack/react-table';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { formatClarityValue, getContractCallTxFunctionArgs } from './utils';

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

export function FunctionArgsTable({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) {
  const args = getContractCallTxFunctionArgs(tx);
  const formattedArgs = args.map(arg => formatClarityValue(arg));
  return <Table columns={columnDefinitions} data={formattedArgs} />;
}
