import { useEffect, useRef } from 'react';

import { NakamotoBlock, StacksApiSocketClient } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';

interface Subscription {
  unsubscribe(): void;
}

export function useSubscribeBlocksUIBlock(handleBlock: (block: NakamotoBlock) => void) {
  const subscription = useRef<Subscription | undefined>(undefined);
  const { stacksApiSocketClientInfo } = useGlobalContext();
  const { client, connect, disconnect } = stacksApiSocketClientInfo || {};

  useEffect(() => {
    const subscribe = async (client: StacksApiSocketClient) => {
      subscription.current = client?.subscribeBlocks(block => {
        handleBlock({
          ...(block as unknown as NakamotoBlock),
          parent_index_block_hash: '',
          tx_count: 0,
        });
      });
    };

    if (!client?.socket.connected) {
      connect?.(client => subscribe(client));
    }
    return () => {
      disconnect?.();
    };
  }, [client, handleBlock, connect, disconnect]);
  return subscription;
}
