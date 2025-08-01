import { ValueBasisFilterPopover } from '@/common/components/table/filters/value-basis-filter/ValueBasisFiterPopover';
import { Text } from '@/ui/Text';
import { Flex, Grid, Stack } from '@chakra-ui/react';

import {
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { DetailsCard } from './DetailsCard';
import { TxHeader } from './TxHeader';
import { TabsContentContainer } from './TxTabs';
import { TxSummary } from './tx-summary/TxSummary';

export const CoinbasePage = ({ tx }: { tx: CoinbaseTransaction | MempoolCoinbaseTransaction }) => {
  return (
    <>
      <TxHeader tx={tx} />
      <Stack gap={3}>
        <Flex justifyContent={'space-between'} w="full">
          <Text textStyle="text-regular-xl">Overview</Text>
          <Flex alignItems={'center'} gap={2}>
            <Text textStyle="text-regular-sm">Show:</Text>
            <ValueBasisFilterPopover />
          </Flex>
        </Flex>
        <Grid templateColumns={{ base: '1fr', md: '1fr auto' }} gap={2}>
          <TabsContentContainer>
            <TxSummary tx={tx} />
          </TabsContentContainer>

          <DetailsCard tx={tx as Transaction} />
        </Grid>
      </Stack>
    </>
  );
};
