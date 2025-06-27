import { act, renderHook } from '@testing-library/react';

import { useBlockListWebSocket } from '../useBlockListWebSocket';

// Mock useSubscribeBlocks
jest.mock('../useSubscribeBlocks', () => ({
  useSubscribeBlocks: jest.fn(),
}));

// Create mock blocks
const createMockBlock = (index: number) => ({
  hash: `block-hash-${index}`,
  height: index,
  parent_index_block_hash: '',
  tx_count: 0,
});

describe('useBlockListWebSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('limits the number of blocks in memory to MAX_BLOCKS_IN_MEMORY (100)', () => {
    let capturedHandleBlock: ((block: any) => void) | undefined;

    // Capture the handleBlock callback passed to useSubscribeBlocks
    const { useSubscribeBlocks } = require('../useSubscribeBlocks');
    useSubscribeBlocks.mockImplementation(
      (liveUpdates: boolean, handleBlock: (block: any) => void) => {
        capturedHandleBlock = handleBlock;
      }
    );

    const { result } = renderHook(() => useBlockListWebSocket(true, new Set()));

    // Add 150 blocks (more than MAX_BLOCKS_IN_MEMORY)
    act(() => {
      for (let i = 0; i < 150; i++) {
        capturedHandleBlock?.(createMockBlock(i));
      }
    });

    // Verify only 100 blocks are kept
    expect(result.current.latestStxBlocks.length).toBe(100);
    expect(result.current.latestStxBlocksCount).toBe(100);

    // Verify newest blocks are kept (LIFO order)
    expect(result.current.latestStxBlocks[0].hash).toBe('block-hash-149');
    expect(result.current.latestStxBlocks[99].hash).toBe('block-hash-50');
  });

  it('does not add duplicate blocks', () => {
    let capturedHandleBlock: ((block: any) => void) | undefined;

    const { useSubscribeBlocks } = require('../useSubscribeBlocks');
    useSubscribeBlocks.mockImplementation(
      (liveUpdates: boolean, handleBlock: (block: any) => void) => {
        capturedHandleBlock = handleBlock;
      }
    );

    const initialHashes = new Set(['block-hash-1']);
    const { result } = renderHook(() => useBlockListWebSocket(true, initialHashes));

    // Try to add the same block that's in initialHashes
    act(() => {
      capturedHandleBlock?.(createMockBlock(1));
    });

    // Verify block was not added
    expect(result.current.latestStxBlocks.length).toBe(0);

    // Add a different block
    act(() => {
      capturedHandleBlock?.(createMockBlock(2));
    });

    // Verify new block was added
    expect(result.current.latestStxBlocks.length).toBe(1);
    expect(result.current.latestStxBlocks[0].hash).toBe('block-hash-2');
  });

  it('clears all blocks when clearLatestStxBlocks is called', () => {
    let capturedHandleBlock: ((block: any) => void) | undefined;

    const { useSubscribeBlocks } = require('../useSubscribeBlocks');
    useSubscribeBlocks.mockImplementation(
      (liveUpdates: boolean, handleBlock: (block: any) => void) => {
        capturedHandleBlock = handleBlock;
      }
    );

    const { result } = renderHook(() => useBlockListWebSocket(true, new Set()));

    // Add some blocks
    act(() => {
      capturedHandleBlock?.(createMockBlock(1));
      capturedHandleBlock?.(createMockBlock(2));
    });

    expect(result.current.latestStxBlocks.length).toBe(2);

    // Clear blocks
    act(() => {
      result.current.clearLatestStxBlocks();
    });

    expect(result.current.latestStxBlocks.length).toBe(0);
  });
});
