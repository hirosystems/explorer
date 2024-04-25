'use client';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { BlockListProvider } from '../BlockListProvider';
import { BlockListWithControls } from './BlockListWithControls';
import { useBlockList } from './useBlockList';

const LIST_LENGTH = 17;

function NonPaginatedBlockListLayoutABase() {
  const { blockList, updateList, latestBlocksCount } = useBlockList(LIST_LENGTH);

  return (
    <BlockListWithControls
      blockList={blockList}
      latestBlocksCount={latestBlocksCount}
      updateList={updateList}
    />
  );
}

export function NonPaginatedBlockListLayoutA() {
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
        <NonPaginatedBlockListLayoutABase />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
