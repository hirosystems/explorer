'use client';

import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { Controls } from '../Controls';
import { BlockListProvider } from '../LayoutA/Provider';
import { useBlockListContext } from '../LayoutA/context';
import { PaginatedBlockListLayoutA } from '../Ungrouped/Paginated2';
import { BlocksPageBlockListGroupedByBtcBlock2 } from './BlocksPageBlockListGroupedByBtcBlock';
import { BlocksPageBlockListGroupedByBtcBlockSkeleton } from './skeleton';

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
      {groupedByBtc ? <BlocksPageBlockListGroupedByBtcBlock2 /> : <PaginatedBlockListLayoutA />}
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
