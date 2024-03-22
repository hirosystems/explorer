'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { SkeletonBlockList } from '../../common/components/loaders/skeleton-text';
import { useIsNakamoto } from '../../common/hooks/useIsNakamoto';
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

const BlocksPage: NextPage = () => {
  const isNakamoto = useIsNakamoto();

  return (
    <>
      <PageTitle>Blocks</PageTitle>
      {isNakamoto ? <PaginatedBlockListLayoutA /> : <BlocksList />}
    </>
  );
};

export default BlocksPage;
