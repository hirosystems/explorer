'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { BlocksPageBlockListSkeleton } from '../_components/BlockList/Grouped/skeleton';
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
  return (
    <BlocksPageLayout
      title={'Recent blocks'}
      blocksPageHeaders={null}
      blocksList={<BlocksPageBlockListDynamic />}
    />
  );
};

export default BlocksPage;
