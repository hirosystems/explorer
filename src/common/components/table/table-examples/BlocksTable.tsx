'use client';

import { useInfiniteQueryResult } from '@/common/hooks/useInfiniteQueryResult';
import { useBurnBlocks } from '@/common/queries/useBurnBlocksInfinite';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BurnBlock } from '@stacks/stacks-blockchain-api-types';

import { Table } from '../Table';
import { TableContainer } from '../TableContainer';
import { StacksBlockIntervalCellRenderer } from './BlocksTableCellRenderers';

export enum BlocksTableColumns {
  BlockHeight = 'blockHeight',
  BlockHash = 'blockHash',
  StacksBlocksInterval = 'stacksBlocksInterval',
  StacksBlocksCount = 'stacksBlocksCount',
  StacksTxCount = 'stacksTxCount',
  //   TotalFees = 'totalFees', TODO: this is not available in the API
  Timestamp = 'timestamp',
}

type StacksBlocksInterval = {
  start: string;
  end: string;
  startHash: string;
  endHash: string;
};

export interface BlocksTableData {
  [BlocksTableColumns.BlockHeight]: string;
  [BlocksTableColumns.BlockHash]: string;
  [BlocksTableColumns.StacksBlocksInterval]: StacksBlocksInterval;
  [BlocksTableColumns.StacksBlocksCount]: string;
  [BlocksTableColumns.StacksTxCount]: string;
  [BlocksTableColumns.Timestamp]: string;
}

export const columns: ColumnDef<BlocksTableData>[] = [
  {
    id: BlocksTableColumns.BlockHeight,
    header: 'Block Height',
    accessorKey: BlocksTableColumns.BlockHeight,
    cell: info => info.getValue() as string,
  },
  {
    id: BlocksTableColumns.BlockHash,
    header: 'Block Hash',
    accessorKey: BlocksTableColumns.BlockHash,
    cell: info => info.getValue() as string,
  },
  {
    id: BlocksTableColumns.StacksBlocksInterval,
    header: 'Stacks Blocks Interval',
    accessorKey: BlocksTableColumns.StacksBlocksInterval,
    cell: info => StacksBlockIntervalCellRenderer(info.getValue() as StacksBlocksInterval),
  },
  {
    id: BlocksTableColumns.StacksBlocksCount,
    header: 'Stacks Blocks Count',
    accessorKey: BlocksTableColumns.StacksBlocksCount,
    cell: info => info.getValue() as string,
  },
  {
    id: BlocksTableColumns.StacksTxCount,
    header: 'Stacks Tx Count',
    accessorKey: BlocksTableColumns.StacksTxCount,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
  {
    id: BlocksTableColumns.Timestamp,
    header: 'Timestamp',
    accessorKey: BlocksTableColumns.Timestamp,
    cell: info => info.getValue() as string,
  },
];

export function BlocksTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const response = useBurnBlocks(pagination.pageSize, pagination.pageIndex * pagination.pageSize);
  const burnBlocks = useInfiniteQueryResult<BurnBlock>(response, pagination.pageSize);

  const pageCount = response.data?.pages[0]?.total
    ? Math.ceil(response.data?.pages[0].total / pagination.pageSize)
    : 0;
  const totalRows = response.data?.pages[0].total || 0;

  const handlePageChange = useCallback((page: PaginationState) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: page.pageIndex,
    }));
  }, []);

  const rowData: BlocksTableData[] = useMemo(
    () =>
      burnBlocks.map(block => {
        return {
          [BlocksTableColumns.BlockHeight]: block.burn_block_height.toString(),
          [BlocksTableColumns.BlockHash]: block.burn_block_hash,
          [BlocksTableColumns.StacksBlocksInterval]: {
            start: block.burn_block_time.toString(),
            end: block.burn_block_time.toString(),
            startHash: block.burn_block_hash,
            endHash: block.burn_block_hash,
          },
          [BlocksTableColumns.StacksBlocksCount]: block.stacks_blocks.length.toString(),
          [BlocksTableColumns.StacksTxCount]: block.total_tx_count.toString(),
          [BlocksTableColumns.Timestamp]: block.burn_block_time.toString(),
        };
      }),
    [burnBlocks]
  );

  // Because we don't want to show the loading state during pagination, we use this to get an initial load state
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (burnBlocks.length > 0) {
      setIsInitialLoad(false);
    }
  }, [burnBlocks]);

  return (
    <Table
      data={rowData}
      columns={columns}
      tableContainerWrapper={table => <TableContainer>{table}</TableContainer>}
      // isLoading={response.isLoading}
      isLoading={isInitialLoad}
      pagination={{
        manualPagination: true,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        pageCount,
        totalRows,
        onPageChange: handlePageChange,
      }}
    />
  );
}
