'use client';

import dynamic from 'next/dynamic';
import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../common/components/Section';
import { ExplorerErrorBoundary } from '../ErrorBoundary';
import { useBlockListContext } from './BlockListContext';
import { BlockListProvider } from './BlockListProvider';
import { Controls } from './Controls';
import { BlocksPageBlockListGroupedByBtcBlockSkeleton } from './GroupedByBurnBlock/skeleton';
import { BlocksPageBlockListUngroupedSkeleton } from './Ungrouped/skeleton';

const BlocksPageBlockListGroupedByBtcBlockDynamic = dynamic(
  () =>
    import('./GroupedByBurnBlock/BlocksPageBlockListGroupedByBtcBlock').then(
      mod => mod.BlocksPageBlockListGroupedByBtcBlock
    ),
  {
    loading: () => <BlocksPageBlockListGroupedByBtcBlockSkeleton />,
    ssr: false,
  }
);

const BlocksPageUngroupedBlockListDynamic = dynamic(
  () =>
    import('./Ungrouped/BlocksPageUngroupedBlockList').then(
      mod => mod.BlocksPageUngroupedBlockList
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
      {/* {groupedByBtc ? <BlocksPageBlockListGroupedByBtcBlock /> : <BlocksPageUngroupedBlockList />} */}
      {groupedByBtc ? (
        <BlocksPageBlockListGroupedByBtcBlockDynamic />
      ) : (
        <BlocksPageUngroupedBlockListDynamic />
      )}
    </Section>
  );
}

export function BlocksPageBlockList() {
  // TODO: fix the suspense fallback
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
      <BlockListProvider>
        <Suspense fallback={<BlocksPageBlockListGroupedByBtcBlockSkeleton />}>
          <BlocksPageBlockListBase />
        </Suspense>
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
