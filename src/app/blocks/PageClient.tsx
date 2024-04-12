'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { useGlobalContext } from '../../common/context/useAppContext';
<<<<<<< HEAD
import { PaginatedBlockListLayoutA } from '../_components/BlockList/LayoutA/Paginated';
=======
import { BlocksPageHeaders } from '../_components/BlockList/BlocksPage/BlocksPageHeaders';
import { BlocksPageBlockListSkeleton } from '../_components/BlockList/Grouped/skeleton';
import { SkeletonBlockList } from '../_components/BlockList/SkeletonBlockList';
>>>>>>> c13e9712 (feat(grouped-by-btc-block-list-view-3): added table layout for ungrouped)
import { PageTitle } from '../_components/PageTitle';

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

const BlocksListDynamic = dynamic(() => import('../_components/BlockList').then(mod => mod.BlocksList), {
  loading: () => <SkeletonBlockList />,
  ssr: false,
});

export function BlocksPageLayout({
  blocksPageHeaders,
  blocksList,
}: {
  blocksPageHeaders: React.ReactNode;
  blocksList: React.ReactNode;
}) {
  return (
    <>
      <PageTitle>Recent blocks</PageTitle>
      {blocksPageHeaders}
      {blocksList}
    </>
  );
}

const BlocksPage: NextPage = () => {
  const { activeNetworkKey } = useGlobalContext();
  return (
    <>
      <PageTitle>Blocks</PageTitle>
      <PaginatedBlockListLayoutA />
    </>
  );
};

export default BlocksPage;
