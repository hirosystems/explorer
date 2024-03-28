'use client';

import { useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { Controls } from '../Controls';
import { BlockListProvider } from '../LayoutA/Provider';
import { UpdateBar } from '../LayoutA/UpdateBar';
import { useBlockListContext } from '../LayoutA/context';
import { BurnBlockGroup } from './BurnBlockGroup';
import { useBlockListGroupedByBtcBlockHomePage } from './useBlockListGroupedByBtcBlockHomePage';

// const LIST_LENGTH = 17;

function HomePageBlockListGroupedByBtcBlockBase() {
  const {
    groupedByBtc,
    setGroupedByBtc,
    liveUpdates,
    setLiveUpdates,
    isBlockListLoading: isUpdateListLoading,
  } = useBlockListContext();
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
    <Section>
      <Box overflowX={'auto'} py={6}>
        <Controls
          groupByBtc={{
            onChange: () => {
              setGroupedByBtc(!groupedByBtc);
            },
            isChecked: groupedByBtc,
            isDisabled: true,
          }}
          liveUpdates={{
            onChange: toggleLiveUpdates,
            isChecked: liveUpdates,
          }}
          // horizontal={horizontalControls}
        />
        {!liveUpdates && (
          <UpdateBar
            isUpdateListLoading={isUpdateListLoading}
            latestBlocksCount={latestBlocksCount}
            onClick={updateBlockList}
          />
        )}
        <Flex flexDirection="column" gap={4}>
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
        <HomePageBlockListGroupedByBtcBlockBase />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
