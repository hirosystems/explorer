'use client';

import { TabsContainer } from '../../common/components/TabsContainer';
import { Skeleton as SkeletonItem } from '../../components/ui/skeleton';
import { SkeletonTxsList } from '../../features/txs-list/SkeletonTxsList';
import { PageTitle } from '../_components/PageTitle';
import { StatsWrapper } from '../_components/Stats/StatsWrapper';
import { SkeletonStatSection } from '../_components/Stats/skeleton';

export default function Skeleton() {
  return (
    <>
      <PageTitle>
        <SkeletonItem width={'400px'} height={'43px'} />
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
            id: 'confirmed',
            content: <SkeletonTxsList />,
          },
          {
            title: 'Pending',
            id: 'pending',
            content: <SkeletonTxsList />,
          },
        ]}
        actions={null}
        gridColumnEnd={'3'}
      />
    </>
  );
}
