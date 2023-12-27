'use client';

import * as React from 'react';

import { TabsContainer } from '../../../common/components/TabsContainer';
import { SkeletonTxsList } from '../../../features/txs-list/SkeletonTxsList';
import { Flex } from '../../../ui/Flex';
import { Skeleton } from '../../../ui/Skeleton';
import { PageTitle } from '../../_components/PageTitle';
import { SkeletonStatSection } from '../../_components/Stats/SkeletonStatSection';
import { Wrapper as StatsWrapper } from '../../_components/Stats/Wrapper';

export default function Loading() {
  return (
    <>
      <PageTitle>
        <Skeleton width={'400px'} height={'43px'} />
      </PageTitle>
      <StatsWrapper>
        <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />
        <SkeletonStatSection borderRightWidth={['0px', '0px', '0px', '1px']} />
        <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />
        <SkeletonStatSection />
      </StatsWrapper>

      <TabsContainer
        tabs={[
          {
            title: 'Confirmed',
            content: <SkeletonTxsList />,
          },
          {
            title: 'Pending',
            content: <SkeletonTxsList />,
          },
        ]}
        actions={null}
        gridColumnEnd={'3'}
      />
    </>
  );
}
