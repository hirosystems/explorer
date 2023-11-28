import * as React from 'react';

import {
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export function TokenTransferPage({
  tx,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
}) {
  return <TxPage tx={tx} txDetails={<TxDetails tx={tx} />} />;
}
