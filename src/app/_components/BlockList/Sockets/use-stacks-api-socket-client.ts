import { useCallback, useRef, useState } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

import { NetworkModes } from '../../../../common/types/network';

export interface StacksApiSocketClientInfo {
  client: StacksApiSocketClient | undefined;
  connect: (handleOnConnect?: (client: StacksApiSocketClient) => void) => void;
  disconnect: () => void;
}

export function useStacksApiSocketClient(network: NetworkModes): StacksApiSocketClientInfo {
  const [socketClient, setSocketClient] = useState<StacksApiSocketClient | undefined>(undefined);
  const socketUrlTracker = useRef<string | null>(null);
  const isSocketClientConnecting = useRef(false);

  const connect = useCallback(
    async (handleOnConnect?: (client: StacksApiSocketClient) => void) => {
      if (!network) return;
      if (socketClient?.socket.connected || isSocketClientConnecting.current) {
        return;
      }
      try {
        isSocketClientConnecting.current = true;
        const socketUrl = `https://api.${network}.hiro.so/`;
        socketUrlTracker.current = socketUrl;
        console.log('Connecting to socket', socketUrl);
        const client = await StacksApiSocketClient.connect({ url: socketUrl });
        client.socket.on('connect', () => {
          console.log('Connected to socket');
          setSocketClient(client);
          handleOnConnect?.(client);
          isSocketClientConnecting.current = false;
        });
        client.socket.on('disconnect', () => {
          console.log('Disconnected from socket');
          setSocketClient(undefined);
          isSocketClientConnecting.current = false;
        });
        client.socket.on('connect_error', error => {
          console.log('Socket connection error', error);
          setSocketClient(undefined);
          isSocketClientConnecting.current = false;
        });
      } catch (error) {
        setSocketClient(undefined);
        isSocketClientConnecting.current = false;
      }
    },
    [network, socketClient]
  );

  const disconnect = useCallback(() => {
    if (socketClient?.socket.connected) {
      console.log('Disconnecting from socket');
      socketClient?.socket.close();
    }
  }, [socketClient]);

  return {
    client: socketClient,
    connect,
    disconnect,
  };
}
