import { Block, NakamotoBlock } from '@stacks/blockchain-api-client';

import {
  BtcBlockMap,
  generateBlockList,
} from '../utils';

// Mock data for testing
const stxBlocks: (Block | NakamotoBlock)[] = [
  {
    canonical: true,
    height: 1,
    hash: 'stxHash1',
    block_time: 1622547800,
    block_time_iso: '2021-06-01T00:00:00.000Z',
    index_block_hash: 'indexHash1',
    parent_block_hash: 'parentHash1',
    parent_index_block_hash: 'parentIndexHash1',
    burn_block_time: 1622547800,
    burn_block_time_iso: '2021-06-01T00:00:00.000Z',
    burn_block_hash: 'burnHash1',
    burn_block_height: 1,
    miner_txid: 'txid1',
    tx_count: 10,
    execution_cost_read_count: 100,
    execution_cost_read_length: 200,
    execution_cost_runtime: 300,
    execution_cost_write_count: 400,
    execution_cost_write_length: 500,
  },
  {
    canonical: true,
    height: 2,
    hash: 'stxHash2',
    block_time: 1622548800,
    block_time_iso: '2021-06-01T01:00:00.000Z',
    index_block_hash: 'indexHash2',
    parent_block_hash: 'parentHash2',
    parent_index_block_hash: 'parentIndexHash2',
    burn_block_time: 1622548800,
    burn_block_time_iso: '2021-06-01T01:00:00.000Z',
    burn_block_hash: 'burnHash2',
    burn_block_height: 2,
    miner_txid: 'txid2',
    tx_count: 20,
    execution_cost_read_count: 200,
    execution_cost_read_length: 300,
    execution_cost_runtime: 400,
    execution_cost_write_count: 500,
    execution_cost_write_length: 600,
  },
  {
    canonical: true,
    height: 3,
    hash: 'stxHash3',
    block_time: 1622549800,
    block_time_iso: '2021-06-01T02:00:00.000Z',
    index_block_hash: 'indexHash3',
    parent_block_hash: 'parentHash3',
    parent_index_block_hash: 'parentIndexHash3',
    burn_block_time: 1622549800,
    burn_block_time_iso: '2021-06-01T02:00:00.000Z',
    burn_block_hash: 'burnHash2',
    burn_block_height: 1,
    miner_txid: 'txid3',
    tx_count: 30,
    execution_cost_read_count: 300,
    execution_cost_read_length: 400,
    execution_cost_runtime: 500,
    execution_cost_write_count: 600,
    execution_cost_write_length: 700,
  },
];

const btcBlocksMap: BtcBlockMap = {
  burnHash1: {
    burn_block_time: 1622547800,
    burn_block_time_iso: '2021-06-01T00:00:00.000Z',
    burn_block_hash: 'burnHash1',
    burn_block_height: 1,
    stacks_blocks: ['stxHash1', 'stxHash3'],
    avg_block_time: 600,
    total_tx_count: 40,
  },
  burnHash2: {
    burn_block_time: 1622548800,
    burn_block_time_iso: '2021-06-01T01:00:00.000Z',
    burn_block_hash: 'burnHash2',
    burn_block_height: 2,
    stacks_blocks: ['stxHash2'],
    avg_block_time: 600,
    total_tx_count: 20,
  },
};

// Mock implementations for createBlockListStxBlock and createBlockListBtcBlock
jest.mock('../utils', () => ({
  createBlockListStxBlock: jest.fn(block => ({ ...block, transformed: true })),
  createBlockListBtcBlock: jest.fn(btcBlock => ({ ...btcBlock, transformed: true })),
  createBlockListBtcBlockFromStxBlock: jest.fn(stxBlock => ({ ...stxBlock, transformed: true })),
}));

describe('generateBlockList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns an empty array if stxBlocks is empty', () => {
    expect(generateBlockList([], btcBlocksMap)).toEqual([]);
  });

  test('returns an empty array if btcBlocksMap is empty', () => {
    expect(generateBlockList(stxBlocks, {})).toEqual([]);
  });

  test('returns correct block list for single stxBlock', () => {
    const singleStxBlock = [stxBlocks[0]];
    const result = generateBlockList(singleStxBlock, btcBlocksMap);

    expect(result).toEqual([
      {
        stxBlocks: [createBlockListStxBlock(singleStxBlock[0])],
        btcBlock: createBlockListBtcBlock(btcBlocksMap[singleStxBlock[0].burn_block_hash]),
      },
    ]);
  });

  test('returns correct block list for multiple stxBlocks', () => {
    const result = generateBlockList(stxBlocks, btcBlocksMap);

    expect(result).toEqual([
      {
        stxBlocks: [createBlockListStxBlock(stxBlocks[0])],
        btcBlock: createBlockListBtcBlock(btcBlocksMap[stxBlocks[0].burn_block_hash]),
      },
      {
        stxBlocks: [createBlockListStxBlock(stxBlocks[1])],
        btcBlock: createBlockListBtcBlock(btcBlocksMap[stxBlocks[1].burn_block_hash]),
      },
      {
        stxBlocks: [createBlockListStxBlock(stxBlocks[2])],
        btcBlock: createBlockListBtcBlock(btcBlocksMap[stxBlocks[2].burn_block_hash]),
      },
    ]);
  });

  test('groups stxBlocks with the same burn_block_hash together', () => {
    const stxBlocksWithSameBurnHash = [
      {
        canonical: true,
        height: 1,
        hash: 'stxHash1',
        block_time: 1622547800,
        block_time_iso: '2021-06-01T00:00:00.000Z',
        index_block_hash: 'indexHash1',
        parent_block_hash: 'parentHash1',
        parent_index_block_hash: 'parentIndexHash1',
        burn_block_time: 1622547800,
        burn_block_time_iso: '2021-06-01T00:00:00.000Z',
        burn_block_hash: 'burnHash1',
        burn_block_height: 1,
        miner_txid: 'txid1',
        tx_count: 10,
        execution_cost_read_count: 100,
        execution_cost_read_length: 200,
        execution_cost_runtime: 300,
        execution_cost_write_count: 400,
        execution_cost_write_length: 500,
      },
      {
        canonical: true,
        height: 2,
        hash: 'stxHash3',
        block_time: 1622549800,
        block_time_iso: '2021-06-01T02:00:00.000Z',
        index_block_hash: 'indexHash3',
        parent_block_hash: 'parentHash3',
        parent_index_block_hash: 'parentIndexHash3',
        burn_block_time: 1622549800,
        burn_block_time_iso: '2021-06-01T02:00:00.000Z',
        burn_block_hash: 'burnHash1',
        burn_block_height: 1,
        miner_txid: 'txid3',
        tx_count: 30,
        execution_cost_read_count: 300,
        execution_cost_read_length: 400,
        execution_cost_runtime: 500,
        execution_cost_write_count: 600,
        execution_cost_write_length: 700,
      },
    ];

    const result = generateBlockList(stxBlocksWithSameBurnHash, btcBlocksMap);

    expect(result).toEqual([
      {
        stxBlocks: [
          createBlockListStxBlock(stxBlocksWithSameBurnHash[0]),
          createBlockListStxBlock(stxBlocksWithSameBurnHash[1]),
        ],
        btcBlock: createBlockListBtcBlock(
          btcBlocksMap[stxBlocksWithSameBurnHash[0].burn_block_hash]
        ),
      },
    ]);
  });

  test('correctly handles non-matching burn_block_hash', () => {
    const stxBlocksWithNonMatchingBurnHash = [
      {
        canonical: true,
        height: 1,
        hash: 'stxHash1',
        block_time: 1622547800,
        block_time_iso: '2021-06-01T00:00:00.000Z',
        index_block_hash: 'indexHash1',
        parent_block_hash: 'parentHash1',
        parent_index_block_hash: 'parentIndexHash1',
        burn_block_time: 1622547800,
        burn_block_time_iso: '2021-06-01T00:00:00.000Z',
        burn_block_hash: 'burnHash1',
        burn_block_height: 1,
        miner_txid: 'txid1',
        tx_count: 10,
        execution_cost_read_count: 100,
        execution_cost_read_length: 200,
        execution_cost_runtime: 300,
        execution_cost_write_count: 400,
        execution_cost_write_length: 500,
      },
      {
        canonical: true,
        height: 2,
        hash: 'stxHash2',
        block_time: 1622548800,
        block_time_iso: '2021-06-01T01:00:00.000Z',
        index_block_hash: 'indexHash2',
        parent_block_hash: 'parentHash2',
        parent_index_block_hash: 'parentIndexHash2',
        burn_block_time: 1622548800,
        burn_block_time_iso: '2021-06-01T01:00:00.000Z',
        burn_block_hash: 'burnHash2',
        burn_block_height: 2,
        miner_txid: 'txid2',
        tx_count: 20,
        execution_cost_read_count: 200,
        execution_cost_read_length: 300,
        execution_cost_runtime: 400,
        execution_cost_write_count: 500,
        execution_cost_write_length: 600,
      },
    ];

    const btcBlocksMapWithNonMatchingHash: BtcBlockMap = {
      burnHash1: {
        burn_block_time: 1622547800,
        burn_block_time_iso: '2021-06-01T00:00:00.000Z',
        burn_block_hash: 'burnHash1',
        burn_block_height: 1,
        stacks_blocks: ['stxHash1', 'stxHash3'],
        avg_block_time: 600,
        total_tx_count: 40,
      },
      burnHash3: {
        burn_block_time: 1622549800,
        burn_block_time_iso: '2021-06-01T02:00:00.000Z',
        burn_block_hash: 'burnHash3',
        burn_block_height: 3,
        stacks_blocks: ['stxHash4'],
        avg_block_time: 600,
        total_tx_count: 20,
      },
    };

    const result = generateBlockList(
      stxBlocksWithNonMatchingBurnHash,
      btcBlocksMapWithNonMatchingHash
    );

    expect(result).toEqual([
      {
        stxBlocks: [createBlockListStxBlock(stxBlocksWithNonMatchingBurnHash[0])],
        btcBlock: createBlockListBtcBlock(
          btcBlocksMapWithNonMatchingHash[stxBlocksWithNonMatchingBurnHash[0].burn_block_hash]
        ),
      },
      {
        stxBlocks: [createBlockListStxBlock(stxBlocksWithNonMatchingBurnHash[1])],
        btcBlock: createBlockListBtcBlockFromStxBlock(stxBlocksWithNonMatchingBurnHash[1]), // Because there's no matching burn block for hash 'burnHash2' in the provided btcBlocksMap
      },
    ]);
  });
});
