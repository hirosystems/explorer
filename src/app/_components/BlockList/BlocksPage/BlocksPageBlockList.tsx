'use client';

import dynamic from 'next/dynamic';
import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { BlockListProvider } from '../BlockListProvider';
import { Controls } from '../Controls';
import { BlocksPageBlockListGroupedSkeleton } from '../Grouped/skeleton';
import { BlocksPageBlockListUngroupedSkeleton } from '../Ungrouped/skeleton';

const BlocksPageBlockListGroupedDynamic = dynamic(
  () => import('./Grouped/BlocksPageBlockListGrouped').then(mod => mod.BlocksPageBlockListGrouped),
  {
    loading: () => <BlocksPageBlockListGroupedSkeleton />,
    ssr: false,
  }
);

const BlocksPageBlockListUngroupedDynamic = dynamic(
  () =>
    import('./Ungrouped/BlocksPageBlockListUngrouped').then(
      mod => mod.BlocksPageBlockListUngrouped
    ),
  {
    loading: () => <BlocksPageBlockListUngroupedSkeleton />,
    ssr: false,
  }
);

function BlocksPageBlockListBase() {
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
    <Section>
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
        horizontal={true}
      />
      {groupedByBtc ? (
        <BlocksPageBlockListGroupedDynamic />
      ) : (
        <BlocksPageBlockListUngroupedDynamic />
      )}
    </Section>
  );
}

export function BlocksPageBlockList() {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<BlocksPageBlockListGroupedSkeleton />}>
        <BlockListProvider>
          <BlocksPageBlockListBase />
        </BlockListProvider>
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
