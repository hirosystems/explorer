'use client';

import { Stack } from '@/ui/Stack';
import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { Controls } from '../Controls';
import { BlockListProvider } from '../LayoutA/Provider';
import { UpdateBar } from '../LayoutA/UpdateBar';
import { FADE_DURATION } from '../LayoutA/consts';
import { useBlockListContext } from '../LayoutA/context';
import { BurnBlockGroup } from './BurnBlockGroup';
import { HomePageBlockListGroupedByBtcBlockSkeleton } from './skeleton';
import { useBlockListGroupedByBtcBlockHomePage } from './useBlockListGroupedByBtcBlockHomePage';

function HomePageBlockListGroupedByBtcBlockBase() {
  const { groupedByBtc, setGroupedByBtc, liveUpdates, setLiveUpdates, isBlockListLoading } =
    useBlockListContext();
  const { blockList, updateBlockList, latestBlocksCount } = useBlockListGroupedByBtcBlockHomePage();

  const lastClickTimeRef = useRef(0);
  const toggleLiveUpdates = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 2000) {
      lastClickTimeRef.current = now;
      setLiveUpdates(!liveUpdates);
    }
  }, [liveUpdates, setLiveUpdates]);
  return (
    <Section py={6} px={0}>
      <Box overflowX={'auto'}>
        <Stack
          px={5}
          gap={3}
          pb={6}
          borderBottom={liveUpdates ? '1px solid var(--stacks-colors-borderPrimary)' : 'none'}
        >
          <Text fontWeight="medium">Recent Blocks</Text>
          <Controls
            groupByBtc={{
              onChange: () => {
                setGroupedByBtc(!groupedByBtc);
              },
              isChecked: groupedByBtc,
              // isDisabled: true,
            }}
            liveUpdates={{
              onChange: toggleLiveUpdates,
              isChecked: liveUpdates,
            }}
            padding={0}
            gap={3}
            marginX={0}
            border="none"
          />
        </Stack>
        {!liveUpdates && (
          <UpdateBar
            isUpdateListLoading={isBlockListLoading}
            latestBlocksCount={latestBlocksCount}
            onClick={updateBlockList}
            marginX={0}
          />
        )}
        <Flex
          flexDirection="column"
          gap={4}
          py={4}
          px={5}
          style={{
            transition: `opacity ${FADE_DURATION / 1000}s`,
            opacity: isBlockListLoading ? 0 : 1,
          }}
        >
          {blockList.map(block => (
            <BurnBlockGroup
              burnBlock={block.burnBlock}
              stxBlocks={block.stxBlocks}
              stxBlocksDisplayLimit={block.stxBlocksDisplayLimit}
            />
          ))}
        </Flex>
      </Box>
    </Section>
  );
}

export function HomePageBlockListGroupedByBtcBlock() {
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
      <BlockListProvider>
        <Suspense fallback={<HomePageBlockListGroupedByBtcBlockSkeleton />}>
          <HomePageBlockListGroupedByBtcBlockBase />
        </Suspense>
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}

function HomePageBlockListGroupedByBtcBlockBase2() {
  const { liveUpdates, isBlockListLoading } = useBlockListContext();
  const { blockList, updateBlockList, latestBlocksCount } = useBlockListGroupedByBtcBlockHomePage();

  return (
    <Box overflowX={'auto'}>
      {!liveUpdates && (
        <UpdateBar
          isUpdateListLoading={isBlockListLoading}
          latestBlocksCount={latestBlocksCount}
          onClick={updateBlockList}
          marginX={0}
        />
      )}
      <Flex
        flexDirection="column"
        gap={4}
        py={4}
        px={5}
        style={{
          transition: `opacity ${FADE_DURATION / 1000}s`,
          opacity: isBlockListLoading ? 0 : 1,
        }}
      >
        {blockList.map(block => (
          <BurnBlockGroup
            burnBlock={block.burnBlock}
            stxBlocks={block.stxBlocks}
            stxBlocksDisplayLimit={block.stxBlocksDisplayLimit}
          />
        ))}
      </Flex>
    </Box>
  );
}

export function HomePageBlockListGroupedByBtcBlock2() {
  return (
    <Suspense fallback={<HomePageBlockListGroupedByBtcBlockSkeleton />}>
      <HomePageBlockListGroupedByBtcBlockBase2 />
    </Suspense>
  );
}
