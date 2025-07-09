import { Grid } from '@chakra-ui/react';

import {
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { DetailsCard } from './DetailsCard';
import { TxHeader } from './TxHeader';
import { TxSummary } from './TxSummary';

export const CoinbasePage = ({ tx }: { tx: CoinbaseTransaction | MempoolCoinbaseTransaction }) => {
  return (
    <>
      <TxHeader tx={tx} />
      <Grid templateColumns={{ base: '1fr', md: '1fr auto' }} gap={2}>
        <TxSummary tx={tx} />
        <DetailsCard tx={tx as Transaction} />
      </Grid>
    </>
  );
};
