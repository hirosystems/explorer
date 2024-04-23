import { useEffect, useRef } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../../common/context/useAppContext';

interface Subscription {
  unsubscribe(): void;
}

export function useSubscribeBlocks(handleBlock: (block: NakamotoBlock | Block) => void) {
  const subscription = useRef<Subscription | undefined>(undefined);
  const { stacksApiSocketClientInfo } = useGlobalContext();
  const { client, connect, disconnect } = stacksApiSocketClientInfo || {};

  useEffect(() => {
    const subscribe = async (client: StacksApiSocketClient) => {
      subscription.current = client?.subscribeBlocks((block: Block) => {
        handleBlock({
          ...block,
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
