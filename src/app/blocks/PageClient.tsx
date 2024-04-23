'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { useGlobalContext } from '../../common/context/useAppContext';
import { NetworkModes } from '../../common/types/network';
import { BlocksPageHeaders } from '../_components/BlockList/BlocksPage/BlocksPageHeaders';
import { BlocksPageBlockListSkeleton } from '../_components/BlockList/Grouped/skeleton';
import { SkeletonBlockList } from '../_components/BlockList/SkeletonBlockList';
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
  const isNakaTestnet = chain === NetworkModes.Testnet && activeNetworkKey.indexOf('naka') !== -1;
  return (
    <BlocksPageLayout
      title={isNakaTestnet ? 'Recent blocks' : 'Blocks'}
      blocksPageHeaders={isNakaTestnet ? <BlocksPageHeaders /> : null}
      blocksList={
        isNakaTestnet ? <BlocksPageBlockListDynamic /> : <PaginatedBlockListLayoutADynamic />
      }
    />
  );
};

export default BlocksPage;
