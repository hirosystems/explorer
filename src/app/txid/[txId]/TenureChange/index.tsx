import * as React from 'react';

import {
  MempoolTenureChangeTransaction,
  TenureChangeTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export function TenureChangePage({
  tx,
}: {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}) {
  return <TxPage tx={tx} txDetails={<TxDetails tx={tx} />} />;
}
