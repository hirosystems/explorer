import { Stack } from '@chakra-ui/react';

import {
  MempoolTenureChangeTransaction,
  TenureChangeTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TenureAlert } from './Alert';
import { TxHeader } from './TxHeader';
import { TxSummary } from './TxSummary';
import { TxSummaryTable } from './TxSummaryTable';

export const TenureChangePage = ({
  tx,
}: {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}) => {
  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} />
        <TenureAlert />
      </Stack>
      <TxSummaryTable tx={tx} />
    </>
  );
};
