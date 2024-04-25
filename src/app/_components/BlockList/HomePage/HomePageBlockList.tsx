'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { BlockListProvider } from '../BlockListProvider';
import { Controls } from '../Controls';
import { HomePageBlockListGroupedSkeleton } from '../Grouped/skeleton';
import { HomePageBlockListUngroupedSkeleton } from '../Ungrouped/skeleton';

const HomePageBlockListGroupedDynamic = dynamic(
  () => import('./HomePageBlockListGrouped').then(mod => mod.HomePageBlockListGrouped),
  {
    loading: () => <HomePageBlockListGroupedSkeleton />,
    ssr: false,
  }
);

const HomePageBlockListUngroupedDynamic = dynamic(
  () => import('./HomePageBlockListUngrouped').then(mod => mod.HomePageBlockListUngrouped),
  {
    loading: () => <HomePageBlockListUngroupedSkeleton />,
    ssr: false,
  }
);

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
    <Section py={5} px={6}>
      <Stack gap={3} pb={6} borderBottom={liveUpdates ? '1px' : 'none'} marginX={-6} px={6}>
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
          border="none"
        />
      </Stack>
      {groupedByBtc ? <HomePageBlockListGroupedDynamic /> : <HomePageBlockListUngroupedDynamic />}
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
        <HomePageBlockListBase />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}