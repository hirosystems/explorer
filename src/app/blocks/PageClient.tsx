'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { BlocksPageBlockListSkeleton } from '../_components/BlockList/Grouped/skeleton';
import { PageTitle } from '../_components/PageTitle';
import { BlocksTable } from '@/common/components/table/table-examples/BlocksTable';

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
  blocksList,
}: {
  title: React.ReactNode;
  blocksList: React.ReactNode;
}) {
  return (
    <>
      {title}
      {blocksList}
    </>
  );
}

const BlocksPage: NextPage = () => {
  return (
    <BlocksPageLayout
      title={<PageTitle>Recent blocks</PageTitle>}
      // blocksList={<BlocksPageBlockListDynamic />}
      blocksList={<BlocksTable />}
    />
  );
};

export default BlocksPage;
