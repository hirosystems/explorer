import { useCallback, useRef } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

export interface StacksApiSocketClientInfo {
  client: StacksApiSocketClient | null;
  connect: (
    handleOnConnect?: (client: StacksApiSocketClient) => void,
    handleError?: (error: Error) => void
  ) => void;
  disconnect: () => void;
}

export function useStacksApiSocketClient(apiUrl: string): StacksApiSocketClientInfo {
  const socketClientRef = useRef<StacksApiSocketClient | null>(null);
  const isSocketClientConnecting = useRef(false);

  const disconnect = useCallback(() => {
    if (socketClientRef.current?.socket.connected) {
      socketClientRef.current.socket.removeAllListeners();
      socketClientRef.current.socket.close();
      socketClientRef.current = null;
      isSocketClientConnecting.current = false;
    }
  }, []);

  const connect = useCallback(
    async (
      handleOnConnect?: (client: StacksApiSocketClient) => void,
      handleError?: (error: Error) => void
    ) => {
      if (!apiUrl) return;
      if (socketClientRef.current?.socket.connected || isSocketClientConnecting.current) {
        return;
      }
      try {
        isSocketClientConnecting.current = true;
        const client = await StacksApiSocketClient.connect({ url: apiUrl });
        client.socket.on('connect', () => {
          socketClientRef.current = client;
          handleOnConnect?.(client);
        });
        client.socket.on('disconnect', () => {
          client.socket.removeAllListeners();
          client.socket.close();
          disconnect();
        });
        client.socket.on('connect_error', error => {
          client.socket.removeAllListeners();
          client.socket.close();
          disconnect();
          handleError?.(error);
        });
      } catch (error) {
        disconnect();
      }
    },
    [apiUrl, disconnect]
  );

  return {
    client: socketClientRef.current,
    connect,
    disconnect,
  };
}
