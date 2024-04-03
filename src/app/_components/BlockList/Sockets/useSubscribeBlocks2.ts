import { useEffect, useRef } from 'react';

import { StacksApiSocketClient } from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../../common/context/useAppContext';

interface Subscription {
  unsubscribe(): void;
}

// TODO: with the new client code, we should be able to use the client directly
export function useSubscribeBlocks2(handleBlock: (block: NakamotoBlock) => any) {
  const subscription = useRef<Subscription | null>(null);
  const { stacksApiSocket } = useGlobalContext();
  const { client, connect, isConnected } = stacksApiSocket || {};

  useEffect(() => {
    const handleOnConnect = async (client: StacksApiSocketClient) => {
      subscription.current = client.subscribeBlocks((block: Block) => {
        handleBlock({
          ...block,
          parent_index_block_hash: '',
          tx_count: 0,
        });
      });
    };
    if (!isConnected) {
      connect?.(handleOnConnect);
    }
    // return () => {
    //   subscription?.current?.unsubscribe();
    // };
  }, [client, handleBlock, connect, isConnected]);
  return subscription;
}
