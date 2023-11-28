'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { Section } from '../../../common/components/Section';
import { SectionFooterActions } from '../../../common/components/SectionFooterActions';
import { SkeletonBlockList } from '../../../common/components/loaders/skeleton-text';
import { DEFAULT_LIST_LIMIT } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useSuspenseInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '../../../common/queries/useBlockListInfinite';
import { Accordion } from '../../../ui/Accordion';
import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { Switch } from '../../../ui/Switch';
import { ExplorerErrorBoundary } from '../ErrorBoundary';
import { AnimatedBlockAndMicroblocksItem } from './AnimatedBlockAndMicroblocksItem';
import { BlockAndMicroblocksItem } from './BlockAndMicroblocksItem';
import { EnhancedBlock } from './types';

const BlocksListBase: React.FC<{
  limit?: number;
}> = ({ limit }) => {
  const [isLive, setIsLive] = React.useState(false);
  const [initialBlocks, setInitialBlocks] = useState<EnhancedBlock[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);
  const activeNetwork = useGlobalContext().activeNetwork;
  const response = useSuspenseBlockListInfinite();
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;

  const blocks = useSuspenseInfiniteQueryResult<Block>(response, limit);

  useEffect(() => {
    setInitialBlocks(blocks);
  }, [blocks]);

  useEffect(() => {
    if (!isLive) return;
    let sub: {
      unsubscribe?: () => Promise<void>;
    };
    const subscribe = async () => {
      const client = await connectWebSocketClient(activeNetwork.url.replace('https://', 'wss://'));
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
  }, [activeNetwork.url, isLive]);

  const [counter, setCounter] = useState(10000000);

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
    <Section
      title="Recent Blocks"
      gridColumnStart={['1', '1', '2']}
      gridColumnEnd={['2', '2', '3']}
      minWidth={0}
      topRight={
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="blocks-live-view-switch" mb="0">
            live view
          </FormLabel>
          <Switch id="blocks-live-view-switch" onChange={() => setIsLive(!isLive)} />
        </FormControl>
      }
    >
      <Accordion allowMultiple>
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
      </Accordion>
      {!isLive && (
        <SectionFooterActions
          isLoading={isFetchingNextPage}
          hasNextPage={hasNextPage}
          href={limit ? '/blocks' : undefined}
          fetchNextPage={limit ? undefined : fetchNextPage}
          label={'blocks'}
        />
      )}
    </Section>
  );
};

export function BlocksList({ limit }: { limit?: number }) {
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
      <BlocksListBase limit={limit} />
    </ExplorerErrorBoundary>
  );
}
