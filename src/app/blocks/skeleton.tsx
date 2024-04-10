'use client';

import {
  BlockPageHeadersSkeleton,
  BlocksPageBlockListSkeleton,
} from '../_components/BlockList/Grouped/skeleton';
import { BlocksPageLayout } from './PageClient';

export default function BlocksPageSkeleton() {
  return (
    <BlocksPageLayout
      blocksPageHeaders={<BlockPageHeadersSkeleton />}
      blocksList={<BlocksPageBlockListSkeleton />}
    />
  );
}
