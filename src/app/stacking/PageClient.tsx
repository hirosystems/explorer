'use client';

import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { Stack } from '../../ui/Stack';
import ActivePoolsTable from './ActivePools';
import { FAQ } from './FAQ';
import { MetricCards } from './MetricCards';
import { PoxCycleDiagram } from './PoxCycleDiagram';
import { PriceTag } from './PriceTag';
import { StackersEarnings } from './StackersEarnings';

export default function ({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <>
      {/* <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Stacking</PageTitle>
      </Flex> */}
      <Stack gap={3}>
        <Flex justifyContent={'space-between'}>
          <MetricCards />
          <Flex gap={2}>
            <PriceTag price={tokenPrice.btcPrice} token={'btc'} />
            <PriceTag price={tokenPrice.stxPrice} token={'stx'} />
            {/* <PriceTag2 /> */}
            {/* <PriceTag3 /> */}
          </Flex>
        </Flex>
        <Grid templateColumns="5fr 2fr" gap={2} w="full">
          <PoxCycleDiagram />
          <Grid templateRows="1fr auto" gap={3}>
            <StackersEarnings />
            <FAQ />
          </Grid>
        </Grid>
      </Stack>
      <ActivePoolsTable />
    </>
  );
}
