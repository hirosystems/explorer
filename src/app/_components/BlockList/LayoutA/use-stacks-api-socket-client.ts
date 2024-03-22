import { useCallback, useRef } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../../../../common/context/useAppContext';

export function useStacksApiSocketClient(): {
  connection: StacksApiSocketClient | null;
  connect: (handleOnConnect?: (socketClient?: StacksApiSocketClient) => void) => void;
  disconnect: () => void;
} {
  const socketClient = useRef<StacksApiSocketClient | null>(null);
  const socketUrlTracker = useRef<string | null>(null);
  const isSocketClientConnecting = useRef(false);
  const activeNetwork = useGlobalContext().activeNetwork;

  const connect = useCallback(
    async (handleOnConnect?: (sc?: StacksApiSocketClient) => void) => {
      if (socketClient.current?.socket.connected || isSocketClientConnecting.current) {
        return;
      }
      try {
        isSocketClientConnecting.current = true;
        const socketUrl = `https://api.${activeNetwork.mode}.hiro.so/`;
        socketUrlTracker.current = socketUrl;
        const connection = StacksApiSocketClient.connect({ url: socketUrl });
        socketClient.current = connection;
        socketClient.current.socket.on('connect', () => {
          handleOnConnect?.(socketClient.current || undefined);
          isSocketClientConnecting.current = false;
        });
        socketClient.current.socket.on('disconnect', () => {
          isSocketClientConnecting.current = false;
        });
        socketClient.current.socket.on('connect_error', error => {
          isSocketClientConnecting.current = false;
        });
      } catch (error) {
        isSocketClientConnecting.current = false;
      }
    },
    [activeNetwork.mode]
  );

  const disconnect = useCallback(() => {
    if (socketClient.current?.socket.connected) {
      socketClient.current.socket.close();
    }
  }, []);

  return {
    connection: socketClient.current,
    connect,
    disconnect,
  };
}
