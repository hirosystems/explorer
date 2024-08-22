'use client';

import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import ActivePoolsTable from './ActivePools';
import { MetricCards } from './MetricCards';
import StackingCycle from './StackingCycle';

export default function ({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Stacking</PageTitle>
      </Flex>
      <StackingCycle />
      <MetricCards />
      <ActivePoolsTable />
      {/* <StackingCycle2 />
      <StackingCycle3 />
      <StackingCycle4 /> */}
    </>
  );
}
