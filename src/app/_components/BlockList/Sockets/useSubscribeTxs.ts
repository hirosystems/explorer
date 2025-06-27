import { useCallback, useEffect, useRef } from 'react';

import { MempoolTransaction, StacksApiSocketClient } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';

interface Subscription {
  unsubscribe(): void;
}

export function useSubscribeTxs(
  isSubscriptionActive: boolean,
  handleTransaction: (tx: MempoolTransaction) => void,
  handleError?: (client: StacksApiSocketClient | null) => void
) {
  const subscription = useRef<Subscription | undefined>(undefined);
  const { stacksApiSocketClientInfo } = useGlobalContext();
  const { connect, disconnect } = stacksApiSocketClientInfo || {};

  const handleDisconnect = useCallback(() => {
    if (subscription.current) {
      subscription.current.unsubscribe();
      subscription.current = undefined;
    }
    disconnect?.();
  }, [disconnect]);

  useEffect(() => {
    const subscribe = async (client: StacksApiSocketClient) => {
      subscription.current = client?.subscribeMempool(tx => {
        handleTransaction({
          ...tx,
        });
      });
    };

    if (isSubscriptionActive) {
      connect?.(client => subscribe(client), handleError);
    }
    if (!isSubscriptionActive) {
      handleDisconnect();
    }
    return handleDisconnect;
  }, [handleTransaction, connect, isSubscriptionActive, handleDisconnect, handleError]);

  return subscription;
}
