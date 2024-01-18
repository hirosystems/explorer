import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { Subscription } from 'react-redux';

import {
  BurnBlock,
  StacksApiWebSocketClient,
  connectWebSocketClient,
} from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';

import { useGlobalContext } from '../../../../common/context/useAppContext';
import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlocksByBurnBlock } from '../../../../common/queries/useBlocksByBurnBlock';
import { useSuspenseBurnBlocks } from '../../../../common/queries/useBurnBlocks';
import { UIBlock, UIBlockType } from '../types';

const BURN_BLOCK_LENGTH = 2;
const STX_BLOCK_LENGTH = 20;

const createBurnBlockUIBlock = (burnBlock: BurnBlock): UIBlock => ({
  type: UIBlockType.BurnBlock,
  height: burnBlock.burn_block_height,
  hash: burnBlock.burn_block_hash,
  timestamp: burnBlock.burn_block_time,
});

const createBlockUIBlock = (block: NakamotoBlock): UIBlock => ({
  type: UIBlockType.Block,
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

export function useBlockListWebSocket(
  liveUpdates: boolean,
  setFadeEffect: (value: boolean) => void
) {
  const clientRef = React.useRef<StacksApiWebSocketClient | null>(null);
  const subRef = React.useRef<any>(null);
  const activeNetworkUrl = useGlobalContext().activeNetworkKey;
  const [latestBlocks, setLatestBlocks] = React.useState<{ [key: string]: NakamotoBlock }>({});
  const [latestBlock, setLatestBlock] = React.useState<NakamotoBlock>();

  useEffect(() => {
    const subscribe = async () => {
      if (!clientRef.current) {
        clientRef.current = await connectWebSocketClient(
          activeNetworkUrl.replace('https://', 'wss://')
        );
      }

      if (subRef.current?.unsubscribe) {
        await subRef.current.unsubscribe();
      }

      subRef.current = await clientRef.current.subscribeBlocks((block: any) => {
        function updateLatestBlocks() {
          setLatestBlock(block);
          setLatestBlocks(prevLatestBlocks => {
            const updatedList = { ...prevLatestBlocks };
            updatedList[block.hash] = block;
            return updatedList;
          });
        }

        if (liveUpdates) {
          setFadeEffect(true);
          setTimeout(() => {
            updateLatestBlocks();
            setFadeEffect(false);
          }, 500);
        } else {
          updateLatestBlocks();
        }
      });
    };

    void subscribe();

    return () => {
      if (subRef.current?.unsubscribe) {
        void subRef.current?.unsubscribe();
      }
    };
  }, [liveUpdates]);

  const clearLatestBlocks = () => {
    setLatestBlock(undefined);
    setLatestBlocks({});
  };

  return { latestBlocks, clearLatestBlocks, latestBlock };
}

export function useBlockListData() {
  const burnBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(
    useSuspenseBurnBlocks(BURN_BLOCK_LENGTH),
    BURN_BLOCK_LENGTH
  );

  const lastBurnBlock = burnBlocks[0];
  const secondToLastBurnBlock = burnBlocks[1];

  const lastBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(lastBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );
  const secondToLastBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(secondToLastBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );

  return {
    lastBurnBlock,
    secondToLastBurnBlock,
    lastBurnBlockStxBlocks,
    secondToLastBlockStxBlocks,
  };
}

export function useBlockList(
  length: number,
  liveUpdates: boolean,
  setFadeEffect: (value: boolean) => void
) {
  const queryClient = useQueryClient();
  const [displayedBlocks, setDisplayedBlocks] = React.useState<Record<string, number>>({});
  const { latestBlocks, latestBlock, clearLatestBlocks } = useBlockListWebSocket(
    liveUpdates,
    setFadeEffect
  );

  const refetch = useCallback(
    function () {
      clearLatestBlocks();
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getBlocksByBurnBlock'] }),
        queryClient.invalidateQueries({ queryKey: ['burnBlocks'] }),
      ]);
    },
    [queryClient]
  );

  useEffect(() => {
    void refetch();
  }, [liveUpdates, refetch]);

  const {
    lastBurnBlock,
    secondToLastBurnBlock,
    lastBurnBlockStxBlocks,
    secondToLastBlockStxBlocks,
  } = useBlockListData();

  if (liveUpdates) {
    if (latestBlock && !displayedBlocks[latestBlock.hash]) {
      if (latestBlock.burn_block_height === lastBurnBlock.burn_block_height) {
        lastBurnBlockStxBlocks.unshift(latestBlock);
        lastBurnBlock.stacks_blocks.unshift(latestBlock.burn_block_hash);
        setDisplayedBlocks(prevDisplayedBlocks => {
          const updatedList = { ...prevDisplayedBlocks };
          updatedList[latestBlock.hash] = latestBlock.height;
          return updatedList;
        });
      } else {
        clearLatestBlocks();
        setDisplayedBlocks({});
        void refetch();
      }
    }
  }

  let blockList = createUIBlockList(lastBurnBlock, lastBurnBlockStxBlocks, length);

  if (blockList.length < length) {
    const secondToLastBlockList = createUIBlockList(
      secondToLastBurnBlock,
      secondToLastBlockStxBlocks,
      length - blockList.length
    );
    blockList = blockList.concat(secondToLastBlockList);
  }

  return {
    blockList,
    latestBlocks,
    refetch,
  };
}
