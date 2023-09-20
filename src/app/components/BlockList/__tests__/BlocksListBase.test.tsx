import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BlocksListBase from '../';
import { useBlockListInfinite as useBlockListInfiniteActual } from '@/app/common/queries/useBlockListInfinite';
import { connectWebSocketClient as connectWebSocketClientActual } from '@stacks/blockchain-api-client';
import { Block } from '@stacks/stacks-blockchain-api-types';
import { StacksApiWebSocketClient } from '@stacks/blockchain-api-client';

import { EnhancedBlock } from '@/app/components/BlockList/types';

const useBlockListInfinite = useBlockListInfiniteActual as jest.MockedFunction<
  typeof useBlockListInfiniteActual
>;

const connectWebSocketClient = connectWebSocketClientActual as jest.MockedFunction<
  typeof connectWebSocketClientActual
>;
jest.mock('@/common/api/client', () => ({
  useApi: jest.fn(),
}));

jest.mock('@stacks/blockchain-api-client', () => ({
  connectWebSocketClient: jest.fn(),
}));

jest.mock('@/app/common/queries/useBlockListInfinite', () => ({
  useBlockListInfinite: jest.fn(() => ({})),
}));

window.scrollTo = jest.fn();

const LIMIT = 10;

describe('BlocksListBase component', () => {
  let mockSubscribeBlocksCallback: (event: Block) => any;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockClient = {
      subscribeBlocks: jest.fn(callback => {
        mockSubscribeBlocksCallback = callback;
        return {
          unsubscribe: async () => {
            await new Promise(res => setTimeout(res, 50));
          },
        };
      }),
    };

    connectWebSocketClient.mockResolvedValue(mockClient as unknown as StacksApiWebSocketClient);
  });

  it('renders without crashing', () => {
    render(<BlocksListBase limit={LIMIT} />);
  });

  it('displays error when blocks fetching fails', () => {
    useBlockListInfinite.mockReturnValue({
      isError: true,
    } as any);

    render(<BlocksListBase limit={LIMIT} />);
    expect(screen.getByText('Failed to load blocks')).toBeInTheDocument();
  });

  it('displays skeleton loader when blocks are not available', () => {
    useBlockListInfinite.mockReturnValue({} as any);

    render(<BlocksListBase limit={LIMIT} />);
    expect(screen.getByTestId('skeleton-block-list')).toBeInTheDocument();
  });

  it('toggles live view on switch click', async () => {
    useBlockListInfinite.mockReturnValue({
      data: { pages: [{ results: [{ hash: '1' }, { hash: '2' }] }] },
    } as any);

    render(<BlocksListBase limit={LIMIT} />);

    const switchElement = screen.getByRole('checkbox', { name: /live view/i });
    expect(switchElement).toBeInTheDocument();

    act(() => {
      fireEvent.click(switchElement);
    });
    await waitFor(() => {
      expect(switchElement).toBeChecked();
    });
  });

  it('renders blocks from WebSocket correctly and removes old blocks', async () => {
    const mockResult = [
      { hash: '1', height: 1 },
      { hash: '2', height: 2 },
    ];

    useBlockListInfinite.mockReturnValue({
      data: {
        pages: [
          {
            results: mockResult,
          },
        ],
      },
    } as any);

    render(<BlocksListBase limit={LIMIT} />);

    const switchElement = screen.getByRole('checkbox', { name: /live view/i });

    act(() => {
      fireEvent.click(switchElement);
    });

    expect(switchElement).toBeChecked();

    const mockBlock = {
      hash: '3',
      height: 3,
    } as EnhancedBlock;

    await act(async () => {
      await Promise.resolve().then(() => mockSubscribeBlocksCallback(mockBlock));
    });

    // check if the new block is added to the list
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText(`#${mockBlock.height}`)).toBeInTheDocument();
    });

    // add more blocks to the list up to the limit
    await act(async () => {
      await Promise.all(
        Array.from(
          { length: LIMIT - mockResult.length - 1 },
          (_, i) => i + mockResult.length + 1
        ).map(i =>
          Promise.resolve().then(() => {
            mockSubscribeBlocksCallback({
              hash: `${i + 1}`,
              height: i + 1,
            } as EnhancedBlock);
          })
        )
      );
    });

    // check if first and last block are visible in the list
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#10')).toBeInTheDocument();
    });

    // add one more block to the list to trigger the removal of the oldest block
    await act(async () => {
      await Promise.resolve().then(() =>
        mockSubscribeBlocksCallback({
          hash: '11',
          height: 11,
        } as EnhancedBlock)
      );
    });

    // check if the first block is removed from the list
    await waitFor(() => {
      expect(screen.queryByText('#1')).not.toBeInTheDocument();
    });
  });
});
