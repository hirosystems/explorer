import { useCallback, useRef } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { useBlockListContext } from '../BlockListContext';
import { Controls } from '../Controls';
import { UpdateBar } from '../UpdateBar';
import { UIBlock } from '../types';
import { Blocks } from './Blocks';

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
  const { isBlockListLoading, groupedByBtc, setGroupedByBtc, liveUpdates, setLiveUpdates } =
    useBlockListContext();

  const lastClickTimeRef = useRef(0);

  const toggleLiveUpdates = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 2000) {
      lastClickTimeRef.current = now;
      setLiveUpdates(!liveUpdates);
    }
  }, [liveUpdates, setLiveUpdates]);

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
            onChange: toggleLiveUpdates,
            isChecked: liveUpdates,
          }}
          horizontal={horizontalControls}
        />
        {!liveUpdates && <UpdateBar latestBlocksCount={latestBlocksCount} onClick={updateList} />}
        <Blocks blockList={blockList} isUpdateListLoading={isBlockListLoading} />
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
