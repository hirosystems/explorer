import { Stack } from '@chakra-ui/react';

import {
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { getTxAlert } from './Alert';
import { TxHeader } from './TxHeader';
import { TxTabs } from './TxTabs';

export const SmartContractPage = ({
  tx,
}: {
  tx: SmartContractTransaction | MempoolSmartContractTransaction;
}) => {
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
