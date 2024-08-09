'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { useGlobalContext } from '../../common/context/useGlobalContext';
import { useIsNakamotoTestnet } from '../../common/hooks/useIsNakamoto';
import { NetworkModes } from '../../common/types/network';
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
  const { activeNetworkKey, activeNetwork } = useGlobalContext();
  const isNakamotoTestnet = useIsNakamotoTestnet();
  return (
    <BlocksPageLayout
      title={isNakamotoTestnet ? 'Recent blocks' : 'Blocks'}
      blocksPageHeaders={isNakamotoTestnet ? <BlocksPageHeadersDynamic /> : null}
      blocksList={
        isNakamotoTestnet ? <BlocksPageBlockListDynamic /> : <PaginatedBlockListLayoutADynamic />
      }
    />
  );
};

export default BlocksPage;
