'use client';

import type { NextPage } from 'next';

import { useGlobalContext } from '../../common/context/useAppContext';
import { BlocksPageBlockList } from '../_components/BlockList/BlocksPageBlockList';
import { BlocksPageHeaders } from '../_components/BlockList/GroupedByBurnBlock/BlocksPageHeaders';
import { PaginatedBlockListLayoutA } from '../_components/BlockList/LayoutA/Paginated';
import { PageTitle } from '../_components/PageTitle';

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
    <BlocksPageLayout
      blocksPageHeaders={<BlocksPageHeaders />}
      blocksList={
        activeNetworkKey.indexOf('naka') !== -1 ? (
          <BlocksPageBlockList />
        ) : (
          <PaginatedBlockListLayoutA />
        )
      }
    />
  );
};

export default BlocksPage;
