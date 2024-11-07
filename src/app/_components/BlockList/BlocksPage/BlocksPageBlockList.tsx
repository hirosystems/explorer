'use client';

import { Stack } from '@chakra-ui/react';
import { ReactNode, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { BlockListProvider } from '../BlockListProvider';
import { Controls } from '../Controls';
import { BlocksPageBlockListGrouped } from './BlocksPageBlockListGrouped';
import { BlocksPageBlockListUngrouped } from './BlocksPageBlockListUngrouped';

export function BlocksPageBlockListLayout({ children }: { children: ReactNode }) {
  return <Section>{children}</Section>;
}

export function BlocksPageControlsLayout({
  liveUpdates,
  children,
}: {
  liveUpdates?: boolean;
  children: ReactNode;
}) {
  return (
    <Stack
      marginX={-6}
      px={6}
      py={5}
      borderBottom={liveUpdates ? '1px solid var(--stacks-colors-border-primary)' : 'none'}
    >
      {children}
    </Stack>
  );
}

function BlocksPageBlockListBase() {
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
    <BlocksPageBlockListLayout>
      <BlocksPageControlsLayout liveUpdates={liveUpdates}>
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
          horizontal={true}
        />
      </BlocksPageControlsLayout>
      {groupedByBtc ? <BlocksPageBlockListGrouped /> : <BlocksPageBlockListUngrouped />}
    </BlocksPageBlockListLayout>
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
      <BlockListProvider>
        <BlocksPageBlockListBase />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
