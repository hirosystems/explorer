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
  [BlocksColumnIndex.BlockTime]: string;
  [BlocksColumnIndex.BurnBlockHeight]: number;
  [BlocksColumnIndex.BurnBlockHash]: string;
  [BlocksColumnIndex.BurnBlockTime]: string;
};

// Update your SignerRow type to be more type-safe
type BlocksRow = [
  BlocksRowTypes[BlocksColumnIndex.Height],
  BlocksRowTypes[BlocksColumnIndex.Hash],
  BlocksRowTypes[BlocksColumnIndex.BlockTime],
  BlocksRowTypes[BlocksColumnIndex.BurnBlockHeight],
  BlocksRowTypes[BlocksColumnIndex.BurnBlockHash],
  BlocksRowTypes[BlocksColumnIndex.BurnBlockTime],
];

function formatRowData(blocks: NakamotoBlock[]) {
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

  const columnDefinitions: ColumnDefinition[] = useMemo(() => {
    return [
      { id: 'height', header: 'height', accessor: val => val, sortable: true },
      { id: 'hash', header: 'hash', accessor: val => truncateMiddle(val), sortable: false },
      { id: 'block time', header: 'block time', accessor: val => val, sortable: true },
      {
        id: 'burn block height',
        header: 'burn block height',
        accessor: val => val,
        sortable: true,
      },
      {
        id: 'burn block hash',
        header: 'burn block hash',
        accessor: val => truncateMiddle(val),
        sortable: false,
      },
      { id: 'burn block time', header: 'burn block time', accessor: val => val, sortable: true },
    ];
  }, []);
  return (
    <Table
      title="Blocks"
      topRight={null}
      rowData={formattedRowData}
      columnDefinitions={columnDefinitions}
    />
  );
}
