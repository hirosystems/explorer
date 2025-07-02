import {
  MempoolTenureChangeTransaction,
  TenureChangeTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxHeader } from './TxHeader';
import { TxSummary } from './TxSummary';
import { TabsContentContainer as TxSummaryContainer } from './TxTabs';

export const TenureChangePage = ({
  tx,
}: {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}) => {
  return (
    <>
      <TxHeader tx={tx} />
      <TxSummaryContainer>
        <TxSummary tx={tx} />
      </TxSummaryContainer>
    </>
  );
};
