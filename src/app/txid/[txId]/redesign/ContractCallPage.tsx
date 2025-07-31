import { Stack } from '@chakra-ui/react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { getTxAlert } from './Alert';
import { TxHeader } from './TxHeader';
import { TxTabs } from './TxTabs';

export const ContractCallPage = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} />
        {getTxAlert(tx)}
      </Stack>
      <TxTabs tx={tx} />
    </>
  );
};
