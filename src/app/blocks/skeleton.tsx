'use client';

import { BlocksPageBlockListSkeleton } from '../_components/BlockList/Grouped/skeleton';
import { BlocksPageLayout } from './PageClient';

export default function BlocksPageSkeleton() {
  return (
    <BlocksPageLayout
      title="Recent Blocks"
      blocksPageHeaders={null}
      blocksList={<BlocksPageBlockListSkeleton />}
    />
  );
}
