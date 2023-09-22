'use client';

import { useApi } from '@/common/api/client';
import { SkeletonBlockList } from '@/components/loaders/skeleton-text';
import { Section } from '@/components/section';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Accordion } from '@/ui/Accordion';
import { FormControl, FormLabel, Switch } from '@/ui/components';
import { Text } from '@/ui/typography';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';
import { connectWebSocketClient } from '@stacks/blockchain-api-client';

import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useBlockListInfinite } from '../../common/queries/useBlockListInfinite';
import { useGlobalContext } from '@/common/context/useAppContext';
import { AnimatedBlockAndMicroblocksItem } from '@/app/components/BlockList/AnimatedBlockAndMicroblocksItem';
import { EnhancedBlock } from '@/app/components/BlockList/types';
import { DEFAULT_LIST_LIMIT } from '@/common/constants';
import { BlockAndMicroblocksItem } from '@/app/components/BlockList/BlockAndMicroblocksItem';

const BlocksListBase: React.FC<{
  limit?: number;
}> = ({ limit }) => {
  const [isLive, setIsLive] = React.useState(false);
  const [initialBlocks, setInitialBlocks] = useState<EnhancedBlock[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);
  const activeNetwork = useGlobalContext().activeNetwork;
  const api = useApi();
  const response = useBlockListInfinite(api);
  const { isError, isFetchingNextPage, fetchNextPage, hasNextPage } = response;

  const blocks = useInfiniteQueryResult<Block>(response, limit);

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

  if (isError) return <Text>Failed to load blocks</Text>;

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
        <SectionFooterAction
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

export default BlocksListBase;

export const BlocksList = dynamic(() => import('.'), {
  loading: () => <SkeletonBlockList />,
  ssr: false,
});
