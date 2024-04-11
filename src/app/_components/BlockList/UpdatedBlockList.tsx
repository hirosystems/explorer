'use client';

import { useColorModeValue } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { ListFooter } from '../../../common/components/ListFooter';
import { Section } from '../../../common/components/Section';
import { DEFAULT_LIST_LIMIT } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useSuspenseInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '../../../common/queries/useBlockListInfinite';
import { Box } from '../../../ui/Box';
import { Collapse } from '../../../ui/Collapse';
import { FlexProps } from '../../../ui/Flex';
import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { Switch } from '../../../ui/Switch';
import { StxIcon } from '../../../ui/icons';
import { ExplorerErrorBoundary } from '../ErrorBoundary';
import { BurnBlock } from './LayoutA/BurnBlock';
import { StxBlock } from './LayoutA/StxBlock';
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

function UpdatedBlocksListBase({
  limit,
}: {
  limit?: number;
} & FlexProps) {
  const [isLive, setIsLive] = React.useState(false);
  const [initialBlocks, setInitialBlocks] = useState<EnhancedBlock[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);
  const activeNetwork = useGlobalContext().activeNetwork;
  const response = useSuspenseBlockListInfinite();
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const queryClient = useQueryClient();

  const blocks = useSuspenseInfiniteQueryResult<Block>(response, limit);

  const labelColor = useColorModeValue('slate.600', 'slate.400');

  const { webSocketClient } = useGlobalContext();

  const lastClickTimeRef = useRef(0);

  const toggleLiveUpdates = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 2000) {
      lastClickTimeRef.current = now;
      setIsLive(!isLive);
    }
  }, [isLive]);

  useEffect(() => {
    if (!isLive) return;
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
  }, [isLive, queryClient, webSocketClient]);

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

  // if (!allBlocks?.length) return <SkeletonBlockList />; // TODO: fix

  return (
    <Section
      title="Recent Blocks"
      gridColumnStart={['1', '1', '1', '2']}
      gridColumnEnd={['2', '2', '2', '3']}
      minWidth={0}
      flexGrow={0}
      flexShrink={1}
      topRight={
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="blocks-live-view-switch" mb="0" color={labelColor}>
            live view
          </FormLabel>
          <Switch
            id="blocks-live-view-switch"
            isChecked={isLive}
            onChange={() => toggleLiveUpdates()}
          />
        </FormControl>
      }
    >
      <Stack pb={6} gap={5}>
        <Box>
          {allBlocks?.map(block =>
            isLive ? (
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
        <Box>
          {!isLive && (
            <ListFooter
              isLoading={isFetchingNextPage}
              hasNextPage={hasNextPage}
              href={limit ? '/blocks' : undefined}
              fetchNextPage={limit ? undefined : fetchNextPage}
              label={'blocks'}
            />
          )}
        </Box>
      </Stack>
    </Section>
  );
}

export function UpdatedBlocksList({ limit }: { limit?: number }) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Recent Blocks',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <UpdatedBlocksListBase limit={limit} />
    </ExplorerErrorBoundary>
  );
}
