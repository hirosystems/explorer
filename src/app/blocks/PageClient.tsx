'use client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';

import { SkeletonBlockList } from '../../common/components/loaders/skeleton-text';
import { PageTitle } from '../_components/PageTitle';

const BlocksList = dynamic(() => import('../_components/BlockList').then(mod => mod.BlocksList), {
  loading: () => <SkeletonBlockList />,
  ssr: false,
});

const BlocksPage: NextPage = () => {
  return (
    <>
      <PageTitle>Blocks</PageTitle>
      <BlocksList />
    </>
  );
};

export default BlocksPage;
