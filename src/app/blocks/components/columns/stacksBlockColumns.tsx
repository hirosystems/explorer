import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import BitcoinCircleIcon from '@/ui/icons/BitcoinCircleIcon';
import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { CaretRight } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import NextLink from 'next/link';

import { formatTimestamp } from '../../../../common/utils/time-utils';
import { StacksBlockRow } from '../table-rows/StacksBlockRow';

export enum StacksBlockColumnId {
  HEIGHT = 'height',
  HASH = 'hash',
  TRANSACTIONS = 'transactions',
  TOTAL_FEES = 'totalFees',
  TIMESTAMP = 'timestamp',
}
export interface StacksBlockTableData {
  height: number;
  hash: string;
  transactions: number;
  totalFees: string;
  timestamp: number;
}

export interface BurnBlockGroupHeader {
  type: 'burn-block-header';
  burn_block_height: number;
  burn_block_hash: string;
  burn_block_time: number;
  stacks_blocks_count: number;
}

export type StacksTableRow = StacksBlockTableData | BurnBlockGroupHeader;

const BurnBlockHeaderCell = {
  render: (row: BurnBlockGroupHeader) => (
    <DefaultBadge
      variant="solid"
      type="blockHeight"
      fontFamily="matterMono"
      icon={<DefaultBadgeIcon icon={<BitcoinCircleIcon />} color="accent.bitcoin-500" size={4} />}
      label={
        <Flex alignItems="center" gap={3} w="100%">
          <Link
            as={NextLink}
            href={`/btcblock/${row.burn_block_hash}`}
            textStyle="text-mono-sm"
            color="textPrimary"
            textDecoration="underline"
            _hover={{
              color: 'textInteractiveHover',
              textDecorationColor: 'textInteractiveHover',
            }}
            _groupHover={{
              textDecorationColor: 'textPrimary',
              _hover: { textDecorationColor: 'textInteractiveHover' },
            }}
          >
            #{row.burn_block_height}
          </Link>
          <Text as="span" color="iconTertiary">
            •
          </Text>
          <Text textStyle="text-medium-xs" color="textSecondary">
            {formatTimestamp(row.burn_block_time)}
          </Text>
          <Text as="span" color="iconTertiary">
            •
          </Text>
          <Flex align="center" gap={1.5}>
            <Text textStyle="text-medium-xs" color="textSecondary">
              {(row.stacks_blocks_count ?? 0).toLocaleString()} blocks
            </Text>
            <Icon
              h={3}
              w={3}
              color="iconSecondary"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              verticalAlign="middle"
            >
              <CaretRight />
            </Icon>
          </Flex>
        </Flex>
      }
      bg="surfacePrimary"
      border="none"
      _groupHover={{ bg: 'surfaceTertiary' }}
      w="100%"
    />
  ),
};

export const stacksBlockColumns: ColumnDef<StacksTableRow>[] = [
  {
    id: StacksBlockColumnId.HEIGHT,
    header: 'Height',
    accessorKey: StacksBlockColumnId.HEIGHT,
    cell: info => {
      const row = info.row.original as StacksTableRow;
      if ('type' in row && row.type === 'burn-block-header') {
        return BurnBlockHeaderCell.render(row as BurnBlockGroupHeader);
      }
      return StacksBlockRow.HeightCell((row as StacksBlockTableData).height);
    },
    enableSorting: false,
    size: 100,
    meta: {
      isSpanRow: (rowData: StacksTableRow) =>
        'type' in rowData && rowData.type === 'burn-block-header',
    },
  },
  {
    id: StacksBlockColumnId.HASH,
    header: 'Hash',
    accessorKey: StacksBlockColumnId.HASH,
    cell: info => {
      const row = info.row.original;
      if ('type' in row && row.type === 'burn-block-header') {
        return null;
      }
      return StacksBlockRow.HashCell((row as StacksBlockTableData).hash);
    },
    enableSorting: false,
    size: 120,
  },
  {
    id: StacksBlockColumnId.TRANSACTIONS,
    header: 'Transactions',
    accessorKey: StacksBlockColumnId.TRANSACTIONS,
    cell: info => {
      const row = info.row.original;
      if ('type' in row && row.type === 'burn-block-header') {
        return null;
      }
      return StacksBlockRow.TransactionsCell((row as StacksBlockTableData).transactions);
    },
    enableSorting: false,
    size: 120,
    meta: { textAlign: 'right' },
  },
  // {
  //   id: StacksBlockColumnId.TOTAL_FEES,
  //   header: 'Total fees',
  //   accessorKey: StacksBlockColumnId.TOTAL_FEES,
  //   cell: info => {
  //     const row = info.row.original;
  //     if ('type' in row && row.type === 'burn-block-header') {
  //       return null;
  //     }
  //     return StacksBlockRow.TotalFeesCell((row as StacksBlockTableData).totalFees);
  //   },
  //   enableSorting: false,
  //   size: 100,
  //   meta: { textAlign: 'right' },
  // },
  // TODO: API doesn't support fee data at the moment
  {
    id: StacksBlockColumnId.TIMESTAMP,
    header: 'Timestamp',
    accessorKey: StacksBlockColumnId.TIMESTAMP,
    cell: info => {
      const row = info.row.original;
      if ('type' in row && row.type === 'burn-block-header') {
        return null;
      }
      return StacksBlockRow.TimestampCell((row as StacksBlockTableData).timestamp);
    },
    enableSorting: false,
    size: 160,
    meta: { textAlign: 'right' },
  },
];
