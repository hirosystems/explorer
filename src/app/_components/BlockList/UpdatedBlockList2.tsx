'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { Stack } from '../../../ui/Stack';
import { ListFooter } from '../../../common/components/ListFooter';
import { SkeletonBlockList } from '../../../common/components/loaders/skeleton-text';
import { DEFAULT_LIST_LIMIT } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useSuspenseInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '../../../common/queries/useBlockListInfinite';
import { Box } from '../../../ui/Box';
import { Collapse } from '../../../ui/Collapse';
import { FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { StxIcon } from '../../../ui/icons';
import { BurnBlock } from './LayoutA/BurnBlock';
import { StxBlock } from './LayoutA/StxBlock';
import { useBlockListContext } from './LayoutA/context';
import { EnhancedBlock } from './types';

export const animationDuration = 0.8;

export const BlockListItem: React.FC<{ block: Block } & FlexProps> = React.memo(
  ({ block, ...rest }) => {
    return (
      <>
        <StxBlock
          key={block.hash}
          hash={block.hash}
          height={block.height}
          timestamp={block.burn_block_time}
          txsCount={block.txs.length}
          icon={<Icon as={StxIcon} size={2.5} color={'white'} />}
        />
        <BurnBlock
          mr={'-6'}
          ml={'-6'}
          pl={5}
          pr={6}
          key={block.burn_block_hash}
          hash={block.burn_block_hash}
          height={block.burn_block_height}
          timestamp={block.burn_block_time}
        />
      </>
    );
  }
);

export const AnimatedBlockAndMicroblocksItem: FC<{
  block: EnhancedBlock;
  onAnimationExit?: () => void;
}> = ({ block, onAnimationExit }) => {
  const [show, setShow] = useState(!block.animate);
  useEffect(() => {
    if (block.animate) {
      setTimeout(() => {
        setShow(true);
      }, 100);
    }
  }, [block.animate]);
  useEffect(() => {
    if (block.destroy) {
      setShow(false);
    }
  }, [block.destroy]);

  return (
    <Collapse
      in={show}
      animateOpacity
      transition={{
        enter: { duration: animationDuration },
        exit: { duration: animationDuration },
      }}
      onAnimationComplete={state => {
        if (state === 'exit') {
          onAnimationExit?.();
        }
      }}
      data-testid={`block-item-${block.hash}`}
      style={{
        overflow: 'unset',
      }}
    >
      <BlockAndMicroblocksItem block={block} />
    </Collapse>
  );
};

export const BlockAndMicroblocksItem: React.FC<{ block: Block }> = ({ block }) => {
  return <BlockListItem block={block} data-test={`block-${block.hash}`} />;
};

interface Subscription {
  unsubscribe(): Promise<void>;
}

export function UpdatedBlocksList2({
  limit,
}: {
  limit?: number;
} & FlexProps) {
  const { liveUpdates } = useBlockListContext();
  const [initialBlocks, setInitialBlocks] = useState<EnhancedBlock[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);
  const response = useSuspenseBlockListInfinite();
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const queryClient = useQueryClient();

  const blocks = useSuspenseInfiniteQueryResult<Block>(response, limit);

  const { webSocketClient } = useGlobalContext();

  useEffect(() => {
    if (!liveUpdates) return;
    setLatestBlocks([]);
    void queryClient.invalidateQueries({ queryKey: ['blockListInfinite'] });
    let subscription: Subscription;
    const subscribe = async () => {
      if (!webSocketClient) {
        return;
      }
      subscription = await (
        await webSocketClient
      )?.subscribeBlocks((block: any) => {
        setLatestBlocks(prevLatestBlocks => [
          { ...block, microblock_tx_count: {}, animate: true },
          ...prevLatestBlocks,
        ]);
      });
    };
    void subscribe();
    return () => {
      subscription?.unsubscribe();
    };
  }, [liveUpdates, queryClient, webSocketClient]);

  useEffect(() => {
    setInitialBlocks(blocks);
  }, [blocks]);

  const allBlocks = useMemo(() => {
    return [...latestBlocks, ...initialBlocks]
      .sort((a, b) => (b.height || 0) - (a.height || 0))
      .reduce((acc: EnhancedBlock[], block, index) => {
        if (!acc.some(b => b.height === block.height)) {
          acc.push({ ...block, destroy: index >= (limit || DEFAULT_LIST_LIMIT) });
        }
        return acc;
      }, []);
  }, [initialBlocks, latestBlocks, limit]);

  const removeOldBlock = useCallback((block: EnhancedBlock) => {
    setInitialBlocks(prevBlocks => prevBlocks.filter(b => b.height !== block.height));
    setLatestBlocks(prevBlocks => prevBlocks.filter(b => b.height !== block.height));
  }, []);

  if (!allBlocks?.length) return <SkeletonBlockList />;

  return (
    <Box px={5}>
      <Stack gap={5}>
        <Box>
          {allBlocks?.map(block =>
            liveUpdates ? (
              <AnimatedBlockAndMicroblocksItem
                block={block}
                key={block.hash}
                onAnimationExit={() => removeOldBlock(block)}
              />
            ) : (
              <BlockAndMicroblocksItem block={block} key={block.hash} />
            )
          )}
        </Box>
        {!liveUpdates && (
          <ListFooter
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
            href={limit ? '/blocks' : undefined}
            fetchNextPage={limit ? undefined : fetchNextPage}
            label={'blocks'}
          />
        )}
      </Stack>
    </Box>
  );
}
