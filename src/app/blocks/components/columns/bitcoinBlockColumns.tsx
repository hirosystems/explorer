import { ColumnDef } from '@tanstack/react-table';

import { BitcoinBlockRow } from '../table-rows/BitcoinBlockRow';

export enum BitcoinBlockColumnId {
  HEIGHT = 'height',
  HASH = 'hash',
  STACKS_BLOCKS_INTERVAL = 'stacksBlocksInterval',
  STACKS_BLOCKS = 'stacksBlocks',
  STACKS_TXS = 'stacksTxs',
  TOTAL_FEES = 'totalFees',
  TIMESTAMP = 'timestamp',
}

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
    id: BitcoinBlockColumnId.HEIGHT,
    header: 'Height',
    accessorKey: BitcoinBlockColumnId.HEIGHT,
    cell: info =>
      BitcoinBlockRow.HeightCell(info.getValue() as number, info.row.original.burn_block_hash),
    enableSorting: false,
    size: 100,
  },
  {
    id: BitcoinBlockColumnId.HASH,
    header: 'Hash',
    accessorKey: BitcoinBlockColumnId.HASH,
    cell: info =>
      BitcoinBlockRow.HashCell(info.getValue() as string, info.row.original.burn_block_hash),
    enableSorting: false,
    size: 120,
  },
  {
    id: BitcoinBlockColumnId.STACKS_BLOCKS_INTERVAL,
    header: 'Stacks blocks interval',
    accessorKey: BitcoinBlockColumnId.STACKS_BLOCKS_INTERVAL,
    cell: info => BitcoinBlockRow.StacksBlocksIntervalCell(info.getValue() as string[]),
    enableSorting: false,
    size: 200,
  },
  {
    id: BitcoinBlockColumnId.STACKS_BLOCKS,
    header: 'Stacks blocks',
    accessorKey: BitcoinBlockColumnId.STACKS_BLOCKS,
    cell: info => BitcoinBlockRow.StacksBlocksCell(info.getValue() as number),
    enableSorting: false,
    size: 120,
    meta: { textAlign: 'right' },
  },
  {
    id: BitcoinBlockColumnId.STACKS_TXS,
    header: 'Stacks txs',
    accessorKey: BitcoinBlockColumnId.STACKS_TXS,
    cell: info => BitcoinBlockRow.StacksTxsCell(info.getValue() as number),
    enableSorting: false,
    size: 100,
    meta: { textAlign: 'right' },
  },
  {
    id: BitcoinBlockColumnId.TOTAL_FEES,
    header: 'Total fees',
    accessorKey: BitcoinBlockColumnId.TOTAL_FEES,
    cell: info => BitcoinBlockRow.TotalFeesCell(info.getValue() as string),
    enableSorting: false,
    size: 100,
    meta: { textAlign: 'right' },
  },
  {
    id: BitcoinBlockColumnId.TIMESTAMP,
    header: 'Timestamp',
    accessorKey: BitcoinBlockColumnId.TIMESTAMP,
    cell: info => BitcoinBlockRow.TimestampCell(info.getValue() as number),
    enableSorting: false,
    size: 160,
    meta: { textAlign: 'right' },
  },
];
