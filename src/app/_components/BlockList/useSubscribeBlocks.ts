import { useEffect, useState } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../common/context/useAppContext';

interface Subscription {
  unsubscribe(): Promise<void>;
}

export function useSubscribeBlocks(handleBlock: (block: NakamotoBlock) => any) {
  const [subscription, setSubscription] = useState<Subscription>();
  const { webSocketClient } = useGlobalContext();
  useEffect(() => {
    let subscription: Subscription;
    const subscribe = async () => {
      if (!webSocketClient) {
        return;
      }
      subscription = await (
        await webSocketClient
      )?.subscribeBlocks((block: Block) => {
        handleBlock({
          ...block,
          parent_index_block_hash: '',
          tx_count: 0,
        });
      });
      setSubscription(subscription);
    };
    void subscribe();
    return () => {
      subscription?.unsubscribe();
    };
  }, [handleBlock, webSocketClient]);
  return subscription;
}
