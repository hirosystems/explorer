import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxHeader } from './TxHeader';
import { TxTabs } from './TxTabs';

export const TokenTransferPage = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  return (
    <>
      <TxHeader tx={tx} />
      <TxTabs tx={tx} />
    </>
  );
};
