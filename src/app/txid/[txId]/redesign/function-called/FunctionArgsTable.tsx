import { ScrollIndicator } from '@/common/components/ScrollIndicator';
import { Table } from '@/common/components/table/Table';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { ColumnDef } from '@tanstack/react-table';

import { ClarityAbiFunction } from '@stacks/transactions';

import {
  NameCellRenderer,
  TypeCellRenderer,
  ValueCellRenderer,
} from './FunctionCalledTableCellRenderers';
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
    cell: info => NameCellRenderer(info.getValue() as string),
    enableSorting: false,
  },
  {
    id: FunctionArgsTableColumns.Value,
    header: 'Value',
    accessorKey: FunctionArgsTableColumns.Value,
    cell: info => ValueCellRenderer(info.getValue() as string),
    enableSorting: false,
    minSize: 150,
    maxSize: 150,
  },
  {
    id: FunctionArgsTableColumns.Type,
    header: 'Type',
    accessorKey: FunctionArgsTableColumns.Type,
    cell: info => TypeCellRenderer(info.getValue() as string),
    enableSorting: false,
  },
];

export function FunctionArgsTable({
  tx,
  functionAbi,
}: {
  tx: TxDetailsOf<'contract_call'>;
  functionAbi?: ClarityAbiFunction;
}) {
  const args = getContractCallTxFunctionArgs(tx, functionAbi);
  const formattedArgs = args.map(arg => formatClarityValue(arg));
  return (
    <Table
      columns={columnDefinitions}
      data={formattedArgs}
      scrollIndicatorWrapper={table => <ScrollIndicator>{table}</ScrollIndicator>}
    />
  );
}
