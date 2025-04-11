// @ts-nocheck
import { Block, MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types';

import { RecentBlocks, UIMempoolStats, UIStackingCycle } from './data';

// Mock STX price
export function getMockStxPrice(): number {
  return 1.25; // Hardcoded STX price in USD
}

// Mock recent blocks
export function getMockRecentBlocks(): RecentBlocks {
  // Create BTC blocks with numeric timestamp
  const btcBlocks = Array(20)
    .fill(0)
    .map((_, i) => ({
      burn_block_height: 800000 - i,
      burn_block_time: Math.floor(Date.now() / 1000) - i * 600, // Convert to seconds
      burn_block_hash: `0000000000000000000${i}ef12d5bc37cdd9e4362a75dabd8927ffa345bd`,
      stacks_blocks: Array((i % 3) + 1)
        .fill(0)
        .map((_, j) => `block-${i}-${j}`), // Variable number of STX blocks
      total_tx_count: 100 + i * 5,
    }));

  // Get stxBlocksCountPerBtcBlock directly from the btcBlocks data
  const stxBlocksCountPerBtcBlock = btcBlocks.map(block => ({
    burn_block_time: block.burn_block_time, // Now in seconds
    stx_blocks_count: block.stacks_blocks.length,
    total_tx_count: block.total_tx_count,
  }));

  // Also update the stxBlocks with seconds-based timestamps
  return {
    btcBlocks: {
      limit: 20,
      offset: 0,
      total: 1000,
      results: btcBlocks,
    },
    stxBlocks: {
      limit: 20,
      offset: 0,
      total: 1000,
      results: Array(20)
        .fill(0)
        .map((_, i) => ({
          hash: `0xblock${i}hash1234567890abcdef`,
          height: 100000 - i,
          burn_block_time: Math.floor(Date.now() / 1000) - i * 600, // Convert to seconds
          burn_block_height: 800000 - i,
          burn_block_hash: `0000000000000000000${i}ef12d5bc37cdd9e4362a75dabd8927ffa345bd`,
          block_time: Math.floor(Date.now() / 1000) - i * 600, // Convert to seconds
          tx_count: 50 + i,
        })),
    },
    stxBlocksCountPerBtcBlock,
  };
}

// Mock current stacking cycle
export function getMockCurrentStackingCycle(): UIStackingCycle {
  return {
    cycleId: 53,
    stackedStx: 125000000,
    progressPercentage: 65.4,
    blocksTilNextCycle: 1050,
    approximateDaysTilNextCycle: 7,
    approximateStartTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    approximateEndTimestamp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    rewardCycleLength: 2100,
    startBlockHeight: 68500,
    endBlockHeight: 70600,
  };
}

// Mock recent transactions
export function getMockRecentUITxs() {
  return {
    limit: 20,
    offset: 0,
    total: 5000,
    results: Array(20)
      .fill(0)
      .map((_, i) => ({
        tx_id: `0x${i}abcdef1234567890abcdef1234567890abcdef`,
        tx_type: i % 3 === 0 ? 'token_transfer' : i % 3 === 1 ? 'contract_call' : 'smart_contract',
        tx_status: 'success',
        fee_rate: '12500',
        sender_address: `SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B`,
        sponsored: false,
        post_condition_mode: 'allow',
        block_height: 100000 - i,
        block_time: Date.now() - i * 30000, // 30 seconds apart
        canonical: true,
        microblock_canonical: true,
        microblock_sequence: i,
        microblock_hash: `0xmicroblock${i}hash`,
        parent_block_hash: `0xparentblock${i}hash`,
        parent_burn_block_time: Date.now() - i * 600000, // Changed to numeric timestamp
        event_count: 3,
        events: [],
        execution_cost_read_count: 15,
        execution_cost_read_length: 100,
        execution_cost_runtime: 1000000,
        execution_cost_write_count: 10,
        execution_cost_write_length: 200,
      })),
  };
}

// Mock mempool stats
export function getMockMempoolStats(): UIMempoolStats {
  return {
    tx_type_counts: {
      token_transfer: 120,
      smart_contract: 45,
      contract_call: 80,
      poison_microblock: 0,
      coinbase: 0,
      tenure_change: 0,
    },
  };
}

// Mock mempool fee
export function getMockMempoolFee(): MempoolFeePriorities {
  return {
    all: {
      priority: 0.0001,
      fee_rate: 1000,
      fee_rate_per_byte: 10,
      fee_rate_per_kb: 10000,
      fee_rate_per_vbyte: 1250,
    },
    token_transfer: {
      priority: 0.0001,
      fee_rate: 1000,
      fee_rate_per_byte: 10,
      fee_rate_per_kb: 10000,
      fee_rate_per_vbyte: 1250,
    },
    smart_contract: {
      priority: 0.0001,
      fee_rate: 1000,
      fee_rate_per_byte: 10,
      fee_rate_per_kb: 10000,
      fee_rate_per_vbyte: 1250,
    },
    contract_call: {
      priority: 0.0001,
      fee_rate: 1000,
      fee_rate_per_byte: 10,
      fee_rate_per_kb: 10000,
      fee_rate_per_vbyte: 1250,
    },
  };
}
