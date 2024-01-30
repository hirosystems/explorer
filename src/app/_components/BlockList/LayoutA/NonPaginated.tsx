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
import { BlockListWithControls } from './BlockListWithControls';
import { BurnBlock } from './BurnBlock';
import { BlockListProvider } from './Provider';
import { StxBlock } from './StxBlock';
import { UpdateBar } from './UpdateBar';
import { useBlockListContext } from './context';
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
