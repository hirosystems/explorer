'use client';

import React from 'react';

import { SkeletonBlockList } from '../../common/components/loaders/skeleton-text';
import { SkeletonItem as SkeletonElement } from '../../ui/SkeletonItem';
import { PageTitle } from '../_components/PageTitle';

export default function Skeleton() {
  return (
    <>
      <PageTitle>
        <SkeletonElement width={'400px'} height={'43px'} />
      </PageTitle>
      <SkeletonBlockList />
    </>
  );
}
