import { Table } from '@/common/components/table/Table';
import { microToStacksFormatted } from '@/common/utils/utils';
import { ColumnDef } from '@tanstack/react-table';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

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

const formatClarityValueType = (type: string) => {
  if (type === 'bool' || type === 'int' || type === 'principal' || type === 'uint') {
    switch (type) {
      case 'bool':
        return 'Boolean';
      case 'int':
        return 'Integer';
      case 'principal':
        return 'Principal';
      case 'uint':
        return 'Unsigned Integer';
    }
  }

  if (type.includes('tuple')) {
    return 'Tuple';
  }
  return type;
};

const tupleToArr = (tuple: string) =>
  tuple
    .replace('(tuple (', '')
    .replace('))', '')
    .split(') (')
    .map(item => item.split(' '));

function formatTupleResult(tuple: string) {
  const tupleArr = tupleToArr(tuple);
  let result = '';
  tupleArr.forEach((entry: any, index: number) => {
    if (entry && entry.length) {
      const key = entry?.[0]?.replace(/\(/g, '');
      const value = entry?.[1]?.replace(/\)/g, '');
      result += `${key}: ${value}`;

      if (index !== tuple.length - 1) {
        result += ', ';
      }
    }
  });

  return result;
}

interface FunctionArg {
  name: string;
  value: string;
  type: string;
}

function formatFunctionArgs(
  tx: ContractCallTransaction | MempoolContractCallTransaction
): FunctionArg[] {
  const args = (tx?.contract_call?.function_args || []).filter(arg => !!arg);
  console.log('args', args);
  return args.map(arg => {
    let value: string = arg.repr;
    if (arg.type === 'principal') {
      const principal = arg.hex ? (cvToJSON(hexToCV(arg.hex)) || {}).value : '';
      const isContract = principal.includes('.');
      value = isContract ? principal : arg.repr;
    }
    if (arg.type === 'uint') {
      value = arg.repr.replace('u', '');
      if (arg.name.includes('ustx')) {
        value = `${microToStacksFormatted(value)} STX`;
      }
      value = parseInt(value).toLocaleString();
    }
    if (arg.type.includes('tuple')) {
      value = formatTupleResult(arg.repr);
    }

    return {
      name: arg.name,
      value,
      type: formatClarityValueType(arg.type),
    };
  });
}

export function FunctionArgsTable({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) {
  const args = formatFunctionArgs(tx);
  return <Table columns={columnDefinitions} data={args} />;
}
