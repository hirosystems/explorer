import { renderHook } from '@testing-library/react';

import { useSubscribeTxs } from '../useSubscribeTxs';

// Mock the global context
jest.mock('../../../../../common/context/useGlobalContext', () => ({
  useGlobalContext: jest.fn(),
}));

const mockUnsubscribe = jest.fn();
const mockDisconnect = jest.fn();
const mockConnect = jest.fn();

describe('useSubscribeTxs', () => {
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
            subscribeMempool: jest.fn(() => mockSubscription),
          };
          callback(mockClient);
        }),
        disconnect: mockDisconnect,
      },
    });
  });

  it('calls unsubscribe and clears subscription on cleanup', () => {
    const handleTransaction = jest.fn();

    const { unmount } = renderHook(() => useSubscribeTxs(true, handleTransaction));

    // Verify subscription was created
    expect(mockConnect).toHaveBeenCalled();

    // Unmount the hook
    unmount();

    // Verify cleanup was called
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('does not create subscription when isSubscriptionActive is false', () => {
    const handleTransaction = jest.fn();

    renderHook(() => useSubscribeTxs(false, handleTransaction));

    expect(mockConnect).not.toHaveBeenCalled();
  });
});
