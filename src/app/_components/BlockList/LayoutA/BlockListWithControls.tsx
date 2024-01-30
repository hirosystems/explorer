import React from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Controls } from '../Controls';
import { UIBlock } from '../types';
import { Blocks } from './Blocks';
import { UpdateBar } from './UpdateBar';
import { useBlockListContext } from './context';

export function BlockListWithControls({
  blockList,
  latestBlocksCount,
  updateList,
  enablePagination,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  horizontalControls,
}: {
  blockList: UIBlock[];
  latestBlocksCount: number;
  updateList: () => void;
  enablePagination?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  horizontalControls?: boolean;
}) {
  const {
    isUpdateListLoading,
    setIsUpdateListLoading,
    groupedByBtc,
    setGroupedByBtc,
    liveUpdates,
    setLiveUpdates,
  } = useBlockListContext();
  return (
    <Section title="Recent Blocks">
      <Box pb={6}>
        <Controls
          groupByBtc={{
            onChange: () => {
              setGroupedByBtc(!groupedByBtc);
            },
            isChecked: groupedByBtc,
            isDisabled: true,
          }}
          liveUpdates={{
            onChange: () => setLiveUpdates(!liveUpdates),
            isChecked: liveUpdates,
          }}
          horizontal={horizontalControls}
        />
        {!liveUpdates && (
          <UpdateBar
            isUpdateListLoading={isUpdateListLoading}
            latestBlocksCount={latestBlocksCount}
            onClick={updateList}
          />
        )}
        <Blocks blockList={blockList} isUpdateListLoading={isUpdateListLoading} />
        <Box pt={4}>
          {(!liveUpdates || !enablePagination) && (
            <ListFooter
              isLoading={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              label={'blocks'}
            />
          )}
        </Box>
      </Box>
    </Section>
  );
}
