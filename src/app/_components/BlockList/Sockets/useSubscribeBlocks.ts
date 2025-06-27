import { useEffect, useRef } from 'react';

import { Block, NakamotoBlock, StacksApiSocketClient } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';

interface Subscription {
  unsubscribe(): void;
}

export function useSubscribeBlocks(
  liveUpdates: boolean,
  handleBlock: (block: NakamotoBlock | Block) => void,
  handleError?: (client: StacksApiSocketClient | null) => void
) {
  const subscription = useRef<Subscription | undefined>(undefined);
  const { stacksApiSocketClientInfo } = useGlobalContext();
  const { connect, disconnect } = stacksApiSocketClientInfo || {};

  useEffect(() => {
    const subscribe = async (client: StacksApiSocketClient) => {
      subscription.current = client?.subscribeBlocks(block => {
        handleBlock({
          ...(block as Block),
          parent_index_block_hash: '',
          tx_count: 0,
        });
      });
    };

    if (liveUpdates) {
      connect?.(client => subscribe(client), handleError);
    }
    if (!liveUpdates) {
      disconnect?.();
    }
    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
        subscription.current = undefined;
      }
      disconnect?.();
    };
  }, [handleBlock, connect, liveUpdates, disconnect, handleError]);
  return subscription;
}
