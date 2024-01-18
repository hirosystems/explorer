'use client';

import React, { useCallback, useState } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { StxIcon } from '../../../../ui/icons';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { Controls } from '../Controls';
import { UIBlockType } from '../types';
import { BlockCount } from './BlockCount';
import { BurnBlock } from './BurnBlock';
import { StxBlock } from './StxBlock';
import { useBlockList } from './useBlockList';

const LIST_LENGTH = 17;

function BlockListLayoutABase({ limit }: { limit?: number }) {
  const [groupedByBtc, setGroupedByBtc] = React.useState(true);
  const [liveUpdates, setLiveUpdates] = React.useState(false);
  const [fadeEffect, setFadeEffect] = useState(false);

  const { blockList, refetch, latestBlocks } = useBlockList(
    LIST_LENGTH,
    liveUpdates,
    setFadeEffect
  );

  const reloadData = useCallback(async () => {
    setFadeEffect(true);
    await refetch();
    setFadeEffect(false);
  }, [refetch]);

  return (
    <Section title="Recent Blocks">
      <Box pb={6}>
        <Controls
          groupByBtc={{
            onChange: () => {
              setGroupedByBtc(!groupedByBtc);
            },
            isChecked: groupedByBtc,
          }}
          liveUpdates={{
            onChange: () => setLiveUpdates(!liveUpdates),
            isChecked: liveUpdates,
          }}
          update={
            liveUpdates
              ? undefined
              : {
                  isLoading: false,
                  onClick: () => {
                    void reloadData();
                  },
                }
          }
          latestBlocksCount={Object.keys(latestBlocks).length}
        />
        <Stack
          pl={4}
          pr={2}
          gap={0}
          width={'full'}
          style={{
            transition: 'opacity 0.7s',
            opacity: fadeEffect ? 0 : 1,
          }}
        >
          {blockList.map((block, i) => {
            switch (block.type) {
              case UIBlockType.Block:
                return (
                  <StxBlock
                    key={block.hash}
                    hash={block.hash}
                    height={block.height}
                    timestamp={block.timestamp}
                    txsCount={block.txsCount}
                    icon={
                      i === 0 || (i > 0 && blockList[i - 1].type === UIBlockType.BurnBlock) ? (
                        <Icon as={StxIcon} size={2.5} color={'white'} />
                      ) : undefined
                    }
                  />
                );
              case UIBlockType.BurnBlock:
                return (
                  <BurnBlock
                    key={block.hash}
                    hash={block.hash}
                    height={block.height}
                    timestamp={block.timestamp}
                  />
                );
              case UIBlockType.Count:
                return <BlockCount key={block.count} count={block.count} />;
            }
          })}
        </Stack>
        <Box pt={4}>
          <ListFooter href={limit ? '/blocks' : undefined} label={'blocks'} />
        </Box>
      </Box>
    </Section>
  );
}

export function BlockListLayoutA({ limit }: { limit?: number }) {
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
      <BlockListLayoutABase limit={limit} />
    </ExplorerErrorBoundary>
  );
}
