import { useCallback, useEffect, useRef, useState } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';

interface Subscription {
  unsubscribe(): void;
}

// ws abstraction layer that manages creating any kind of api ws subscription and handling connection and disconnection logic based on the UI state
export function useSubscribe(
  subscribeAction: (client: StacksApiSocketClient) => Subscription,
  handleConnect?: (client: StacksApiSocketClient) => void,
  handleDisconnect?: (client: StacksApiSocketClient | null) => void,
  handleError?: (client: StacksApiSocketClient | null) => void
) {
  const subscription = useRef<Subscription | undefined>(undefined);
  const { stacksApiSocketClientInfo } = useGlobalContext();
  const { connect, disconnect } = stacksApiSocketClientInfo || {};

  const [isOn, setIsOn] = useState<boolean>(false);
  const lastClickTimeRef = useRef(0);

  const toggleSubscription = useCallback(
    (state: boolean) => {
      if (state === isOn) {
        return;
      }
      const now = Date.now();
      if (now - lastClickTimeRef.current > 2000) {
        // TODO: notify user why they can't click button
        lastClickTimeRef.current = now;
        setIsOn(state != null ? state : !isOn);
      }
    },
    [isOn]
  );

  useEffect(() => {
    const subscribe = async (client: StacksApiSocketClient) => {
      subscription.current = subscribeAction(client);
    };

    if (isOn) {
      connect?.(
        client => {
          subscribe(client);
          handleConnect?.(client);
        },
        handleDisconnect,
        handleError
      );
    }
    if (!isOn) {
      disconnect?.();
    }
    return () => {
      disconnect?.();
    };
  }, [isOn, subscribeAction, connect, disconnect, handleConnect, handleDisconnect, handleError]);

  return { subscription, toggleSubscription, subscriptionIsOn: isOn };
}
