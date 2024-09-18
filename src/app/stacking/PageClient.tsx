'use client';

import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { Stack } from '../../ui/Stack';
import { ActivePoolsTable } from './ActivePoolsTable';
import { FAQ } from './FAQ';
import { MetricCards } from './MetricCards';
import { PoxCycleDiagram } from './PoxCycleDiagram';
import { PreviousCyclesTable } from './PreviousCyclesTable';
import { PriceTag } from './PriceTag';
import { StackersEarnings } from './StackersEarnings';

export default function ({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <>
      {/* <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Stacking</PageTitle>
      </Flex> */}
      <Stack gap={3}>
        <Flex flexWrap="wrap" gap={4} alignItems="center" justifyContent="space-between">
          <MetricCards />
          <Flex gap={2} flexWrap="nowrap">
            <PriceTag price={tokenPrice.btcPrice} token={'btc'} />
            <PriceTag price={tokenPrice.stxPrice} token={'stx'} />
          </Flex>
        </Flex>
        <Stack
          // gap={9} TODO: why isnt this working?
          gap="40px"
        >
          <Grid templateColumns={['100%', '100%', '100%', '100%', '5fr 2fr']} gap={2} w="full">
            <PoxCycleDiagram />
            <Grid
              templateRows={['100%', '100%', '100%', '100%', '1fr auto']}
              templateColumns={['100%', '1fr 1fr', '1fr 1fr', '1fr 1fr', '100%']}
              gap={3}
            >
              <StackersEarnings />
              <FAQ />
            </Grid>
          </Grid>
          <ActivePoolsTable />
          <PreviousCyclesTable />
        </Stack>
      </Stack>
    </>
  );
}
