import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { CaretRight } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import NextLink from 'next/link';

import { BitcoinBlockChip } from '../../../../common/components/BlockChips';
import { formatTimestamp } from '../../../../common/utils/time-utils';
import { StacksBlockRow } from '../table-rows/StacksBlockRow';

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

export const stacksBlockColumns: ColumnDef<StacksTableRow>[] = [
  {
    id: 'height',
    header: 'Height',
    accessorKey: 'height',
    cell: info => {
      const row = info.row.original as any;
      if ('type' in row && row.type === 'burn-block-header') {
        return (
          <Flex alignItems="center" gap={3} w="100%" pl={1.5}>
            <Link
              as={NextLink}
              href={`/btcblock/${row.burn_block_hash}`}
              _hover={{ textDecoration: 'none' }}
            >
              <BitcoinBlockChip
                value={row.burn_block_height}
                iconColor="iconTertiary"
                bg="transparent"
                px={0}
                py={0}
                width="fit-content"
                textProps={{
                  color: 'textPrimary',
                  textDecoration: 'underline',
                  _hover: { color: 'textInteractiveHover' },
                }}
              />
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
        );
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
    id: 'hash',
    header: 'Hash',
    accessorKey: 'hash',
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
    id: 'transactions',
    header: 'Transactions',
    accessorKey: 'transactions',
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
  {
    id: 'totalFees',
    header: 'Total fees',
    accessorKey: 'totalFees',
    cell: info => {
      const row = info.row.original;
      if ('type' in row && row.type === 'burn-block-header') {
        return null;
      }
      return StacksBlockRow.TotalFeesCell((row as StacksBlockTableData).totalFees);
    },
    enableSorting: false,
    size: 100,
    meta: { textAlign: 'right' },
  },
  {
    id: 'timestamp',
    header: 'Timestamp',
    accessorKey: 'timestamp',
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
