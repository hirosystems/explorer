'use client';

import { Stack } from '@/ui/Stack';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../common/components/Section';
import { Box } from '../../../ui/Box';
import { Text } from '../../../ui/Text';
import { ExplorerErrorBoundary } from '../ErrorBoundary';
import { useBlockListContext } from './BlockListContext';
import { BlockListProvider } from './BlockListProvider';
import { Controls } from './Controls';
import { HomePageBlockListGroupedByBtcBlock } from './GroupedByBurnBlock/HomePageBlockListGroupedByBtcBlock';
import { HomePageBlockListGroupedByBtcBlockSkeleton } from './GroupedByBurnBlock/skeleton';
import { HomePageBlockListUngroupedSkeleton } from './Ungrouped/skeleton';

const HomePageBlockListGroupedByBtcBlockDynamic = dynamic(
  () =>
    import('./GroupedByBurnBlock/HomePageBlockListGroupedByBtcBlock').then(
      mod => mod.HomePageBlockListGroupedByBtcBlock
    ),
  {
    loading: () => <HomePageBlockListGroupedByBtcBlock />,
    ssr: false,
  }
);

const HomePageUngroupedBlockListDynamic = dynamic(
  () =>
    import('./Ungrouped/HomePageUngroupedBlockList').then(mod => mod.HomePageUngroupedBlockList),
  {
    loading: () => <HomePageBlockListUngroupedSkeleton />,
    ssr: false,
  }
);

// const LIST_LENGTH = 17;

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
        {groupedByBtc ? (
          <HomePageBlockListGroupedByBtcBlockDynamic />
        ) : (
          <HomePageUngroupedBlockListDynamic />
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
          <HomePageBlockListBase />
        </Suspense>
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
