import { ColumnDefinition, Table } from '@/common/components/table/Table';
import { useBlocks } from '@/common/queries/useBlocks';
import { truncateMiddle } from '@/common/utils/utils';
import { useMemo } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client';

enum BlocksColumnIndex {
  Height = 0,
  Hash = 1,
  BlockTime = 2,
  BurnBlockHeight = 3,
  BurnBlockHash = 4,
  BurnBlockTime = 5,
}

type BlocksRowTypes = {
  [BlocksColumnIndex.Height]: number;
  [BlocksColumnIndex.Hash]: string;
  [BlocksColumnIndex.BlockTime]: number;
  [BlocksColumnIndex.BurnBlockHeight]: number;
  [BlocksColumnIndex.BurnBlockHash]: string;
  [BlocksColumnIndex.BurnBlockTime]: number;
};

type BlocksRow = [
  BlocksRowTypes[BlocksColumnIndex.Height],
  BlocksRowTypes[BlocksColumnIndex.Hash],
  BlocksRowTypes[BlocksColumnIndex.BlockTime],
  BlocksRowTypes[BlocksColumnIndex.BurnBlockHeight],
  BlocksRowTypes[BlocksColumnIndex.BurnBlockHash],
  BlocksRowTypes[BlocksColumnIndex.BurnBlockTime],
];

function formatRowData(blocks: NakamotoBlock[]): BlocksRow[] {
  return blocks.map(block => [
    block.height,
    block.hash,
    block.block_time,
    block.burn_block_height,
    block.burn_block_hash,
    block.burn_block_time,
  ]);
}

export function BlocksTable() {
  const blocksResponse = useBlocks();
  const rowData: NakamotoBlock[] =
    blocksResponse?.data?.pages[0]?.results ?? ([] as NakamotoBlock[]);
  const formattedRowData = formatRowData(rowData);

  const columnDefinitions: ColumnDefinition<BlocksRow>[] = useMemo(() => {
    return [
      {
        id: 'height',
        header: 'height',
        accessor: row => row[BlocksColumnIndex.Height].toString(),
        sortable: true,
        onSort: (a, b) => a[BlocksColumnIndex.Height] - b[BlocksColumnIndex.Height],
      },
      {
        id: 'hash',
        header: 'hash',
        accessor: row => truncateMiddle(row[BlocksColumnIndex.Hash]),
        sortable: false,
      },
      {
        id: 'block time',
        header: 'block time',
        accessor: row => row[BlocksColumnIndex.BlockTime].toString(),
        sortable: true,
        onSort: (a, b) => a[BlocksColumnIndex.BlockTime] - b[BlocksColumnIndex.BlockTime],
      },
      {
        id: 'burn block height',
        header: 'burn block height',
        accessor: row => row[BlocksColumnIndex.BurnBlockHeight].toString(),
        sortable: true,
        onSort: (a, b) =>
          a[BlocksColumnIndex.BurnBlockHeight] - b[BlocksColumnIndex.BurnBlockHeight],
      },
      {
        id: 'burn block hash',
        header: 'burn block hash',
        accessor: row => truncateMiddle(row[BlocksColumnIndex.BurnBlockHash]),
        sortable: false,
      },
      {
        id: 'burn block time',
        header: 'burn block time',
        accessor: row => row[BlocksColumnIndex.BurnBlockTime].toString(),
        sortable: true,
        onSort: (a, b) => a[BlocksColumnIndex.BurnBlockTime] - b[BlocksColumnIndex.BurnBlockTime],
      },
    ];
  }, []);
  return <Table title="Blocks" rowData={formattedRowData} columnDefinitions={columnDefinitions} />;
}
