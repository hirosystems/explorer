import { useCallback, useRef, useState } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

export interface StacksApiSocketClientInfo {
  client: StacksApiSocketClient | null;
  connect: (handleOnConnect?: (client: StacksApiSocketClient) => void) => void;
  disconnect: () => void;
}

export function useStacksApiSocketClient(apiUrl: string): StacksApiSocketClientInfo {
  const [socketClient, setSocketClient] = useState<StacksApiSocketClient | null>(null);
  const socketUrlTracker = useRef<string | null>(null);
  const isSocketClientConnecting = useRef(false);

  const connect = useCallback(
    async (handleOnConnect?: (client: StacksApiSocketClient) => void) => {
      if (!apiUrl) return;
      if (socketClient?.socket.connected || isSocketClientConnecting.current) {
        return;
      }
      try {
        isSocketClientConnecting.current = true;
        const socketUrl = apiUrl;
        socketUrlTracker.current = socketUrl;
        const client = await StacksApiSocketClient.connect({ url: socketUrl });
        client.socket.on('connect', () => {
          setSocketClient(client);
          handleOnConnect?.(client);
          isSocketClientConnecting.current = false;
        });
        client.socket.on('disconnect', () => {
          setSocketClient(null);
          isSocketClientConnecting.current = false;
        });
        client.socket.on('connect_error', error => {
          setSocketClient(null);
          isSocketClientConnecting.current = false;
        });
      } catch (error) {
        setSocketClient(null);
        isSocketClientConnecting.current = false;
      }
    },
    [apiUrl, socketClient]
  );

  const disconnect = useCallback(() => {
    if (socketClient?.socket.connected) {
      socketClient?.socket.close();
    }
  }, [socketClient]);

  return {
    client: socketClient,
    connect,
    disconnect,
  };
}
