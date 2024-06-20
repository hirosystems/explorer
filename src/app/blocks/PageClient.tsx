'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { useGlobalContext } from '../../common/context/useGlobalContext';
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
  const chain = activeNetwork.mode;
  const isNaka1Testnet =
    chain === NetworkModes.Testnet && activeNetworkKey.indexOf('nakamoto-1') !== -1;
  return (
    <BlocksPageLayout
      title={isNaka1Testnet ? 'Recent blocks' : 'Blocks'}
      blocksPageHeaders={isNaka1Testnet ? <BlocksPageHeadersDynamic /> : null}
      blocksList={
        isNaka1Testnet ? <BlocksPageBlockListDynamic /> : <PaginatedBlockListLayoutADynamic />
      }
    />
  );
};

export default BlocksPage;
