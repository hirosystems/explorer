import { useGlobalContext } from '@/common/context/useAppContext';
import { useSuspenseInfiniteQueryResult } from '@/common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '@/common/queries/useBlockListInfinite';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { BurnBlock, connectWebSocketClient } from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { EnhancedBlock, UIBlock, UIBlockType } from '../types';

// interface Subscription {
//   unsubscribe(): Promise<void>;
// }

const createBurnBlockUIBlock = (burnBlock: BurnBlock): UIBlock => ({
  type: UIBlockType.BurnBlock,
  height: burnBlock.burn_block_height,
  hash: burnBlock.burn_block_hash,
  timestamp: burnBlock.burn_block_time,
});

const createBlockUIBlock = (block: NakamotoBlock): UIBlock => ({
  type: UIBlockType.StxBlock,
  height: block.height,
  hash: block.hash,
  timestamp: block.burn_block_time,
  txsCount: block.tx_count,
});

const createCountUIBlock = (count: number): UIBlock => ({
  type: UIBlockType.Count,
  count,
});

const createUIBlockList = (
  burnBlock: BurnBlock,
  stxBlocks: NakamotoBlock[],
  length: number
): UIBlock[] => {
  const blockList: UIBlock[] = [createBurnBlockUIBlock(burnBlock)];
  if (length <= 1) {
    return blockList;
  }
  const hasCount = burnBlock.stacks_blocks.length > length - 1;
  const stxBlocksToShow = stxBlocks.slice(0, length - 1 - (hasCount ? 1 : 0));

  if (hasCount) {
    blockList.unshift(createCountUIBlock(burnBlock.stacks_blocks.length - stxBlocksToShow.length));
  }

  stxBlocksToShow.reverse().forEach(block => {
    blockList.unshift(createBlockUIBlock(block));
  });

  return blockList;
};

interface BlocksGroupedByParentHash {
  [btcBlockHeight: string]: EnhancedBlock[];
}

function groupBlocksByBtcBlock(blocks: Block[]): Record<string, Block[]> {
  const groupedBlocks: Record<string, Block[]> = {};

  blocks.forEach(block => {
    const btcBlockNum = block.burn_block_height;
    if (!groupedBlocks[btcBlockNum]) {
      groupedBlocks[btcBlockNum] = [block];
    } else {
      groupedBlocks[btcBlockNum].push(block);
    }
  });

  return groupedBlocks;
}

export function useBlockList2(limit?: number): {
  setIsLive: (value: React.SetStateAction<boolean>) => void;
  isLive: boolean;
  setIsGroupedByBtcBlock: (value: React.SetStateAction<boolean>) => void;
  isGroupedByBtcBlock: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  blocks: EnhancedBlock[] | BlocksGroupedByParentHash;
  blocksGroupedByBtcBlock: BlocksGroupedByParentHash;
  removeOldBlock: (block: EnhancedBlock) => void;
} {
  const [isLive, setIsLive] = useState(false);
  const [isGroupedByBtcBlock, setIsGroupedByBtcBlock] = useState(false);

  const [initialBlocks, setInitialBlocks] = useState<EnhancedBlock[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);

  const activeNetwork = useGlobalContext().activeNetwork;

  const response = useSuspenseBlockListInfinite(); // queryKey: ['blockListInfinite', limit]
  console.log('useBlockList copy', { response });

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const blocks = useSuspenseInfiniteQueryResult<Block>(response, limit);
  console.log('useBlockList copy', { blocks });

  // const { data: blocks, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseBlockListInfinite();

  const queryClient = useQueryClient();

  useEffect(() => {
    setInitialBlocks(blocks);
  }, [blocks]);

  // const { connect: stacksApiSocketConnect, disconnect: stacksApiSocketDisconnect } =
  //   useStacksApiSocketClient();

  useEffect(() => {
    // if (isLive) {
    //   void queryClient.invalidateQueries({ queryKey: ['blockListInfinite'] });
    //   stacksApiSocketConnect((socketClient: StacksApiSocketClient | undefined) => {
    //     console.log('socketClient?.subscribeBlocks...');
    //     socketClient?.subscribeBlocks((block: any) => {
    //       console.log('new block received', block);
    //       setLatestBlocks(prevLatestBlocks => [
    //         // TODO: or I could just push this onto the blocks array
    //         { ...block, microblock_tx_count: {}, animate: true },
    //         ...prevLatestBlocks,
    //       ]);
    //     });
    //   });
    // } else {
    //   stacksApiSocketDisconnect();
    // }
    if (!isLive) return;
    void queryClient.invalidateQueries({ queryKey: ['blockListInfinite'] });
    let sub: {
      unsubscribe?: () => Promise<void>;
    };
    const subscribe = async () => {
      const client = await connectWebSocketClient(activeNetwork.url.replace('https://', 'wss://')); // TODO: Save this as ref so that when the live toggle is switched off, we can close the connection. Return subscribe and unsunscribe functions from the hook
      sub = await client.subscribeBlocks((block: any) => {
        setLatestBlocks(prevLatestBlocks => [
          { ...block, microblock_tx_count: {}, animate: true },
          ...prevLatestBlocks,
        ]);
      });
    };
    void subscribe();
    return () => {
      if (sub?.unsubscribe) {
        void sub.unsubscribe();
      }
    };
  }, [isLive, activeNetwork.url, queryClient]);

  // const allBlocks = useMemo(() => {
  //   return [...latestBlocks, ...initialBlocks]
  //     .sort((a, b) => (b.height || 0) - (a.height || 0))
  //     .reduce((acc: EnhancedBlock[], block, index) => {
  //       if (!acc.some(b => b.height === block.height)) {
  //         acc.push({ ...block, destroy: index >= (limit || DEFAULT_LIST_LIMIT) });
  //       }
  //       return acc;
  //     }, []);
  // }, [initialBlocks, latestBlocks, limit]);

  const removeOldBlock = useCallback((block: EnhancedBlock) => {
    setInitialBlocks(prevBlocks => prevBlocks.filter(b => b.height !== block.height));
    setLatestBlocks(prevBlocks => prevBlocks.filter(b => b.height !== block.height));
  }, []);

  let formattedBlocks = [...latestBlocks, ...initialBlocks].sort(
    (a, b) => (b.height || 0) - (a.height || 0)
  ); // desc

  const blocksGroupedByParentHash = groupBlocksByBtcBlock(blocks);

  return {
    setIsLive,
    isLive,
    setIsGroupedByBtcBlock,
    isGroupedByBtcBlock,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    blocks: formattedBlocks,
    blocksGroupedByBtcBlock: blocksGroupedByParentHash,
    removeOldBlock,
  };
}
