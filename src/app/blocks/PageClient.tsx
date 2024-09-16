'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { useRenderNewBlockList } from '../../common/hooks/useIsNakamoto';
import {
  BlockPageHeadersSkeleton,
  BlocksPageBlockListSkeleton,
} from '../_components/BlockList/Grouped/skeleton';
import { SkeletonBlockList } from '../_components/BlockList/SkeletonBlockList';
import { PageTitle } from '../_components/PageTitle';

const BlocksPageHeadersDynamic = dynamic(
  () =>
    import('../_components/BlockList/BlocksPage/BlocksPageHeaders').then(
      mod => mod.BlocksPageHeaders
    ),
  {
    loading: () => <BlockPageHeadersSkeleton />,
    ssr: false,
  }
);

const BlocksPageBlockListDynamic = dynamic(
  () =>
    import('../_components/BlockList/BlocksPage/BlocksPageBlockList').then(
      mod => mod.BlocksPageBlockList
    ),
  {
    loading: () => <BlocksPageBlockListSkeleton />,
    ssr: false,
  }
);

const PaginatedBlockListLayoutADynamic = dynamic(
  () =>
    import('../_components/BlockList/LayoutA/Paginated').then(mod => mod.PaginatedBlockListLayoutA),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);

export function BlocksPageLayout({
  title,
  blocksPageHeaders,
  blocksList,
}: {
  title: string;
  blocksPageHeaders: React.ReactNode;
  blocksList: React.ReactNode;
}) {
  return (
    <>
      <PageTitle>{title}</PageTitle>
      {blocksPageHeaders}
      {blocksList}
    </>
  );
}

const BlocksPage: NextPage = () => {
  const renderNewBlockList = useRenderNewBlockList();
  return (
    <BlocksPageLayout
      title={renderNewBlockList ? 'Recent blocks' : 'Blocks'}
      blocksPageHeaders={renderNewBlockList ? <BlocksPageHeadersDynamic /> : null}
      blocksList={
        renderNewBlockList ? <BlocksPageBlockListDynamic /> : <PaginatedBlockListLayoutADynamic />
      }
    />
  );
};

export default BlocksPage;
