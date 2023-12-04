import { useCallback, useEffect, useState } from 'react';

import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../common/context/useAppContext';
import { EnhancedBlock } from './types';

export function useLatestBlocks() {
  const activeNetwork = useGlobalContext().activeNetwork;
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);

  const addBlock = useCallback((block: Block) => {
    setLatestBlocks(prevBlocks => {
      const isNewBlock = prevBlocks.every(b => b.height !== block.height);
      return isNewBlock ? [{ ...block, animate: true }, ...prevBlocks] : prevBlocks;
    });
  }, []);

  useEffect(() => {
    let sub: {
      unsubscribe?: () => Promise<void>;
    };

    console.log('sub', sub);

    const subscribe = async () => {
      try {
        console.log('subscriping');
        const client = await connectWebSocketClient(
          activeNetwork.url.replace('https://', 'wss://')
        );
        sub = await client.subscribeBlocks(addBlock);
      } catch (error) {
        console.error('Error setting up WebSocket subscription:', error);
      }
    };

    void subscribe();

    return () => {
      if (sub?.unsubscribe) {
        console.log('unnsub');
        void sub.unsubscribe();
      }
    };
  }, [activeNetwork.url, addBlock]);

  return { latestBlocks, resetLatestBlocks: () => setLatestBlocks([]) };
}
