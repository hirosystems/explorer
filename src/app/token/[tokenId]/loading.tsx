'use client';

import * as React from 'react';

import { TabsContainer } from '../../../common/components/TabsContainer';
import { ExplorerSkeletonLoader } from '../../../common/components/loaders/skeleton-common';
import { SkeletonTransactionList } from '../../../common/components/loaders/skeleton-transaction';
import { Flex } from '../../../ui/Flex';
import { PageTitle } from '../../_components/PageTitle';
import { SkeletonStatSection } from '../../_components/Stats/SkeletonStatSection';
import { Wrapper as StatsWrapper } from '../../_components/Stats/Wrapper';

export default function Loading() {
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>
        <ExplorerSkeletonLoader width={'400px'} height={'31px'} />
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
            content: <SkeletonTransactionList />,
          },
          {
            title: 'Pending',
            content: <SkeletonTransactionList />,
          },
        ]}
        actions={null}
        gridColumnEnd={'3'}
      />
    </Flex>
  );
}
