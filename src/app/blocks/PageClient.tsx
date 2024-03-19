'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { SkeletonBlockList } from '../../common/components/loaders/skeleton-text';
import { useGlobalContext } from '../../common/context/useAppContext';
import { PageTitle } from '../_components/PageTitle';

const BlocksList = dynamic(() => import('../_components/BlockList').then(mod => mod.BlocksList), {
  loading: () => <SkeletonBlockList />,
  ssr: false,
});

const PaginatedBlockListLayoutA = dynamic(
  () =>
    import('../_components/BlockList/LayoutA/Paginated').then(mod => mod.PaginatedBlockListLayoutA),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);

const NonPaginatedBlockListGroupedByBurnBlock = dynamic(
  () =>
    import('../_components/BlockList/GroupedByBurnBlock/NonPaginated').then(
      mod => mod.NonPaginatedBlockListGroupedByBurnBlock
    ),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);

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
