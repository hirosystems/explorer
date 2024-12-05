'use client';

import { BlocksPageBlockListSkeleton } from '../_components/BlockList/Grouped/skeleton';
import { PageTitle } from '../_components/PageTitle';
import { BlocksPageLayout } from './PageClient';

export default function BlocksPageSkeleton() {
  return (
    <BlocksPageLayout
      title={<PageTitle>Recent Blocks</PageTitle>}
      blocksPageHeaders={null}
      blocksList={<BlocksPageBlockListSkeleton />}
    />
  );
}
