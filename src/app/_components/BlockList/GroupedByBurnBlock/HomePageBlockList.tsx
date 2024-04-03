'use client';

import { Stack } from '@/ui/Stack';
import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { DEFAULT_BLOCKS_LIST_LIMIT } from '../../../../common/constants/constants';
import { Box } from '../../../../ui/Box';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { Controls } from '../Controls';
import { BlockListProvider } from '../LayoutA/Provider';
import { useBlockListContext } from '../LayoutA/context';
import { UpdatedBlocksList2 } from '../UpdatedBlockList2';
import { HomePageBlockListGroupedByBtcBlock2 } from './HomePageBlockListGroupedByBtcBlock';
import { HomePageBlockListGroupedByBtcBlockSkeleton } from './skeleton';

function HomePageBlockListBase() {
  const { groupedByBtc, setGroupedByBtc, liveUpdates, setLiveUpdates } = useBlockListContext();

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
          borderBottom={
            liveUpdates || !groupedByBtc ? '1px solid var(--stacks-colors-borderPrimary)' : 'none'
          }
        >
          <Text fontWeight="medium">Recent Blocks</Text>
          <Controls
            groupByBtc={{
              onChange: () => {
                setGroupedByBtc(!groupedByBtc);
              },
              isChecked: groupedByBtc,
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
          <HomePageBlockListGroupedByBtcBlock2 />
        ) : (
          <UpdatedBlocksList2 limit={DEFAULT_BLOCKS_LIST_LIMIT} />
        )}
      </Box>
    </Section>
  );
}

export function HomePageBlockList() {
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
          {/** TODO: fix this */}
          <HomePageBlockListBase />
        </Suspense>
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
