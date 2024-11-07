'use client';

import { Stack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { ReactNode, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
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

export function HomePageBlockListLayout({ children }: { children: ReactNode }) {
  return (
    <Section py={5} px={6}>
      {children}
    </Section>
  );
}

export function HomePageControlsLayout({
  liveUpdates,
  children,
}: {
  liveUpdates?: boolean;
  children: ReactNode;
}) {
  return (
    <Stack
      gap={3}
      pb={6}
      marginX={-6}
      px={6}
      borderBottom={liveUpdates ? '1px solid var(--stacks-colors-border-secondary)' : 'none'}
    >
      {children}
    </Stack>
  );
}

function HomePageBlockListBase() {
  const { groupedByBtc, setGroupedByBtc, liveUpdates, setLiveUpdates } = useBlockListContext();

  const lastClickTimeRef = useRef(0);
  const toggleLiveUpdates = useCallback(
    (immediately?: boolean) => {
      const now = Date.now();
      if (immediately || now - lastClickTimeRef.current > 2000) {
        lastClickTimeRef.current = now;
        setLiveUpdates(!liveUpdates);
      }
    },
    [liveUpdates, setLiveUpdates]
  );

  return (
    <HomePageBlockListLayout>
      <HomePageControlsLayout liveUpdates={liveUpdates}>
        <Text fontWeight="medium" py={2}>
          Recent Blocks
        </Text>
        <Controls
          groupByBtc={{
            onChange: () => {
              setGroupedByBtc(!groupedByBtc);
              if (liveUpdates) {
                toggleLiveUpdates(true);
              }
            },
            checked: groupedByBtc,
          }}
          liveUpdates={{
            onChange: () => toggleLiveUpdates(),
            checked: liveUpdates,
          }}
          padding={0}
          border="none"
        />
      </HomePageControlsLayout>
      {groupedByBtc ? <HomePageBlockListGroupedDynamic /> : <HomePageBlockListUngroupedDynamic />}
    </HomePageBlockListLayout>
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
