import { useCallback, useRef } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

import { NetworkModes } from '../../../../common/types/network';

export interface StacksApiSocketClientInfo {
  client: StacksApiSocketClient | null;
  connect: (handleOnConnect?: (client: StacksApiSocketClient) => void) => void;
  disconnect: () => void;
  isConnected: boolean | undefined;
}

export function useStacksApiSocketClient(network: NetworkModes): StacksApiSocketClientInfo {
  const socketClient = useRef<StacksApiSocketClient | null>(null);
  const socketUrlTracker = useRef<string | null>(null);
  const isSocketClientConnecting = useRef(false);

  const connect = useCallback(
    async (handleOnConnect?: (client: StacksApiSocketClient) => void) => {
      if (!network) return;
      if (socketClient.current?.socket.connected || isSocketClientConnecting.current) {
        return;
      }
      try {
        isSocketClientConnecting.current = true;
        const socketUrl = `https://api.${network}.hiro.so/`;
        socketUrlTracker.current = socketUrl;
        const client = StacksApiSocketClient.connect({ url: socketUrl });
        socketClient.current = client;
        socketClient.current.socket.on('connect', () => {
          handleOnConnect?.(client);
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
    [network]
  );

  const disconnect = useCallback(() => {
    if (socketClient.current?.socket.connected) {
      socketClient.current.socket.close();
    }
  }, []);

  return {
    client: socketClient.current,
    connect,
    disconnect,
    isConnected: socketClient.current?.socket.connected,
  };
}
