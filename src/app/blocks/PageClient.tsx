'use client';

import type { NextPage } from 'next';

import { useGlobalContext } from '../../common/context/useAppContext';
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
    <>
      <PageTitle>Blocks</PageTitle>
      <PaginatedBlockListLayoutA />
    </>
  );
};

export default BlocksPage;
