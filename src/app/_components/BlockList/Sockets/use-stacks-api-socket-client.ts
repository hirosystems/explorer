import { useCallback, useRef, useState } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

export interface StacksApiSocketClientInfo {
  client: StacksApiSocketClient | null;
  connect: (
    handleOnConnect?: (client: StacksApiSocketClient) => void,
    handleDisconnect?: (client: StacksApiSocketClient | null) => void,
    handleError?: (client: StacksApiSocketClient | null) => void
  ) => void;
  disconnect: () => void;
}

// ws abstraction layer that handles low level socket connection and disconnection logic
export function useStacksApiSocketClient(apiUrl: string): StacksApiSocketClientInfo {
  const [socketClient, setSocketClient] = useState<StacksApiSocketClient | null>(null);
  const isSocketClientConnecting = useRef(false);

  const disconnect = useCallback(() => {
    if (socketClient?.socket.connected) {
      socketClient?.socket.removeAllListeners();
      socketClient?.socket.close();
      setSocketClient(null);
      isSocketClientConnecting.current = false;
    }
  }, [socketClient]);

  const connect = useCallback(
    async (
      handleOnConnect?: (client: StacksApiSocketClient) => void,
      handleOnDisconnect?: (client: StacksApiSocketClient | null) => void,
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
        });
        client.socket.on('disconnect', () => {
          client.socket.removeAllListeners();
          client.socket.close();
          disconnect();
          handleOnDisconnect?.(client);
        });
        client.socket.on('connect_error', error => {
          client.socket.removeAllListeners();
          client.socket.close();
          disconnect();
          handleError?.(client);
        });
      } catch (error) {
        disconnect();
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
