import { useEffect, useRef } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';
import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';

interface Subscription {
  unsubscribe(): void;
}

export function useSubscribeTxs(
  isSubscriptionActive: boolean,
  handleTransaction: (tx: Transaction) => void,
  handleError?: (client: StacksApiSocketClient | null) => void
) {
  const subscription = useRef<Subscription | undefined>(undefined);
  const { stacksApiSocketClientInfo } = useGlobalContext();
  const { connect, disconnect } = stacksApiSocketClientInfo || {};

  useEffect(() => {
    const subscribe = async (client: StacksApiSocketClient) => {
      subscription.current = client?.subscribeMempool(tx => {
        handleTransaction({
          ...(tx as unknown as Transaction),
        });
      });
    };

    if (isSubscriptionActive) {
      connect?.(client => subscribe(client), handleError);
    }
    if (!isSubscriptionActive) {
      disconnect?.();
    }
    return () => {
      disconnect?.();
    };
  }, [handleTransaction, connect, isSubscriptionActive, disconnect, handleError]);

  return subscription;
}
