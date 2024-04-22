'use client';

import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { Stack } from '../../../../ui/Stack';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { BlockListProvider } from '../BlockListProvider';
import { Controls } from '../Controls';
import { BlocksPageBlockListGroupedSkeleton } from '../Grouped/skeleton';
import { BlocksPageBlockListGrouped } from './BlocksPageBlockListGrouped';
import { BlocksPageBlockListUngrouped } from './BlocksPageBlockListUngrouped';

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
      <Stack
        marginX={-6}
        px={6}
        borderBottom={liveUpdates ? '1px solid var(--stacks-colors-borderPrimary)' : 'none'}
      >
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
      </Stack>
      {groupedByBtc ? <BlocksPageBlockListGrouped /> : <BlocksPageBlockListUngrouped />}
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
