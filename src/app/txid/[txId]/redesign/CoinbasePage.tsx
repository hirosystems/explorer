import { Text } from '@/ui/Text';
import { Grid, Stack } from '@chakra-ui/react';

import {
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { getTxAlert } from './Alert';
import { DetailsCard } from './DetailsCard';
import { TxHeader } from './TxHeader';
import { TabsContentContainer } from './TxTabs';
import { TxSummary } from './tx-summary/TxSummary';

export const CoinbasePage = ({ tx }: { tx: CoinbaseTransaction | MempoolCoinbaseTransaction }) => {
  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} />
        {getTxAlert(tx)}
      </Stack>
      <Stack gap={3}>
        <Text textStyle="heading-xs">Overview</Text>

        <Grid templateColumns={{ base: '1fr', md: '75% 25%' }} gap={2}>
          <TabsContentContainer>
            <TxSummary tx={tx} />
          </TabsContentContainer>

          <DetailsCard tx={tx as Transaction} />
        </Grid>
      </Stack>
    </>
  );
};
