import { useCallback, useRef, useState } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

export interface StacksApiSocketClientInfo {
  client: StacksApiSocketClient | null;
  connect: (
    handleOnConnect?: (client: StacksApiSocketClient) => void,
    handleError?: (client: StacksApiSocketClient | null) => void
  ) => void;
  disconnect: () => void;
}

export function useStacksApiSocketClient(apiUrl: string): StacksApiSocketClientInfo {
  const [socketClient, setSocketClient] = useState<StacksApiSocketClient | null>(null);
  const isSocketClientConnecting = useRef(false);

  const disconnect = useCallback(() => {
    if (socketClient?.socket.connected) {
      socketClient?.socket.removeAllListeners();
      socketClient?.socket.close();
      setSocketClient(null);
    }
  }, [socketClient]);

  const connect = useCallback(
    async (
      handleOnConnect?: (client: StacksApiSocketClient) => void,
      handleError?: (client: StacksApiSocketClient | null) => void
    ) => {
      if (!apiUrl) return;
      if (socketClient?.socket.connected || isSocketClientConnecting.current) {
        return;
      }
      try {
        isSocketClientConnecting.current = true;
        const client = await StacksApiSocketClient.connect({ url: apiUrl });
        client.socket.on('connect', () => {
          setSocketClient(client);
          handleOnConnect?.(client);
          isSocketClientConnecting.current = false;
        });
        client.socket.on('disconnect', () => {
          client.socket.removeAllListeners();
          client.socket.close();
          disconnect();
          isSocketClientConnecting.current = false;
        });
        client.socket.on('connect_error', error => {
          client.socket.removeAllListeners();
          client.socket.close();
          disconnect();
          isSocketClientConnecting.current = false;
          handleError?.(client);
        });
      } catch (error) {
        disconnect();
        isSocketClientConnecting.current = false;
      }
    },
    [apiUrl, socketClient, disconnect]
  );

  return {
    client: socketClient,
    connect,
    disconnect,
  };
}
