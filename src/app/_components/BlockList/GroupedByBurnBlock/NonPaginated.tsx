'use client';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { BlockListProvider } from '../LayoutA/Provider';
import { UIBlockType } from '../types';
import { BlocksGroup } from './BlocksGroup';

const LIST_LENGTH = 17;

function NonPaginatedBlockListGroupedByBurnBlockBase() {
  const blockList = [
    {
      type: UIBlockType.Block,
      height: 10001,
      hash: '0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
    },
    {
      type: UIBlockType.Block,
      height: 10002,
      hash: '0xrerqreqwjdhgjhdgj0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
    },
    {
      type: UIBlockType.Block,
      height: 10003,
      hash: '0xbxvcbxvcbvxcbvxc0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
    },
    {
      type: UIBlockType.Block,
      height: 10004,
      hash: '0xjhjhfhgjhdjdhjhhj0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
    },
  ];

  const burnBlock = {
    height: 332141,
    hash: '0xhfgjdkhbafgkjhdafjkhdsafjkhflkjdsahfjkhdsafhdsafdsaf',
    timestamp: 0,
  };

  return (
    <Section title="Recent Blocks">
      <Box overflowX={'auto'} py={6}>
        <BlocksGroup
          burnBlock={burnBlock}
          stxBlocks={blockList}
          // latestBlocksCount={latestBlocksCount}
          // updateList={updateList}
        />
      </Box>
    </Section>
  );
}

export function NonPaginatedBlockListGroupedByBurnBlock() {
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
        <NonPaginatedBlockListGroupedByBurnBlockBase />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
