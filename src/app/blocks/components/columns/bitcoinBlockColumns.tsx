import { ColumnDef } from '@tanstack/react-table';

import { BitcoinBlockRow } from '../table-rows/BitcoinBlockRow';

export interface BitcoinBlockTableData {
  height: number;
  hash: string;
  stacksBlocksInterval: string[];
  stacksBlocks: number;
  stacksTxs: number;
  totalFees: string;
  timestamp: number;
  burn_block_hash: string;
}

export const bitcoinBlockColumns: ColumnDef<BitcoinBlockTableData>[] = [
  {
    id: 'height',
    header: 'Height',
    accessorKey: 'height',
    cell: info =>
      BitcoinBlockRow.HeightCell(info.getValue() as number, info.row.original.burn_block_hash),
    enableSorting: false,
    size: 100,
  },
  {
    id: 'hash',
    header: 'Hash',
    accessorKey: 'hash',
    cell: info =>
      BitcoinBlockRow.HashCell(info.getValue() as string, info.row.original.burn_block_hash),
    enableSorting: false,
    size: 120,
  },
  {
    id: 'stacksBlocksInterval',
    header: 'Stacks blocks interval',
    accessorKey: 'stacksBlocksInterval',
    cell: info => BitcoinBlockRow.StacksBlocksIntervalCell(info.getValue() as string[]),
    enableSorting: false,
    size: 200,
  },
  {
    id: 'stacksBlocks',
    header: 'Stacks blocks',
    accessorKey: 'stacksBlocks',
    cell: info => BitcoinBlockRow.StacksBlocksCell(info.getValue() as number),
    enableSorting: false,
    size: 120,
    meta: { textAlign: 'right' },
  },
  {
    id: 'stacksTxs',
    header: 'Stacks txs',
    accessorKey: 'stacksTxs',
    cell: info => BitcoinBlockRow.StacksTxsCell(info.getValue() as number),
    enableSorting: false,
    size: 100,
    meta: { textAlign: 'right' },
  },
  {
    id: 'totalFees',
    header: 'Total fees',
    accessorKey: 'totalFees',
    cell: info => BitcoinBlockRow.TotalFeesCell(info.getValue() as string),
    enableSorting: false,
    size: 100,
    meta: { textAlign: 'right' },
  },
  {
    id: 'timestamp',
    header: 'Timestamp',
    accessorKey: 'timestamp',
    cell: info => BitcoinBlockRow.TimestampCell(info.getValue() as number),
    enableSorting: false,
    size: 160,
    meta: { textAlign: 'right' },
  },
];
