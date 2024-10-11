'use client';

import { Box } from '@/ui/Box';
import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { Stack } from '../../ui/Stack';
import { ActivePoolsTable } from './ActivePoolsTable';
import { MetricCards } from './MetricCards';
import { PoxCycleDiagram } from './PoxCycleDiagram';
import { PreviousCyclesTable } from './PreviousCyclesTable';
import { PriceTag } from './PriceTag';

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
          w="full"
        >
          <Grid
            templateColumns={['100%', '100%', '100%', '100%', '1fr 1fr']}
            gap={2}
            w="full"
            maxW="full"
          >
            <PoxCycleDiagram />
            <Box backgroundColor="red" w="full" h="full">
              Hello
            </Box>
            {/* <Grid
              // templateRows={['100%', '100%', '100%', '100%', '1fr auto']}
              templateRows={['auto', 'auto', 'auto', 'auto', '1fr auto']}
              templateColumns={['100%', '1fr 1fr', '1fr 1fr', '1fr 1fr', '100%']}
              gap={3}
              w="full"
              maxW="full"
            >
              <StackersEarnings />
              <FAQ />
            </Grid> */}
          </Grid>
          <ActivePoolsTable />
          <PreviousCyclesTable />
        </Stack>
      </Stack>
    </>
  );
}
