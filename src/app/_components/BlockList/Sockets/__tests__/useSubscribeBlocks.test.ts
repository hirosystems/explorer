import { renderHook } from '@testing-library/react';

import { useSubscribeBlocks } from '../useSubscribeBlocks';

// Mock the global context
jest.mock('../../../../../common/context/useGlobalContext', () => ({
  useGlobalContext: jest.fn(),
}));

const mockUnsubscribe = jest.fn();
const mockDisconnect = jest.fn();
const mockConnect = jest.fn();

describe('useSubscribeBlocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock subscription
    const mockSubscription = {
      unsubscribe: mockUnsubscribe,
    };

    // Mock the global context to return our test client
    const { useGlobalContext } = require('../../../../../common/context/useGlobalContext');
    useGlobalContext.mockReturnValue({
      stacksApiSocketClientInfo: {
        connect: mockConnect.mockImplementation(callback => {
          const mockClient = {
            subscribeBlocks: jest.fn(() => mockSubscription),
          };
          callback(mockClient);
        }),
        disconnect: mockDisconnect,
      },
    });
  });

  it('calls unsubscribe and clears subscription on cleanup', () => {
    const handleBlock = jest.fn();

    const { unmount } = renderHook(() => useSubscribeBlocks(true, handleBlock));

    // Verify subscription was created
    expect(mockConnect).toHaveBeenCalled();

    // Unmount the hook
    unmount();

    // Verify cleanup was called
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('does not create subscription when liveUpdates is false', () => {
    const handleBlock = jest.fn();

    renderHook(() => useSubscribeBlocks(false, handleBlock));

    expect(mockConnect).not.toHaveBeenCalled();
  });
});
