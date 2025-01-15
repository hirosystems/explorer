'use client';

import * as React from 'react';

import {
  Block,
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export function TokenTransferPage({
  tx,
  txBlock,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
  txBlock?: Block;
}) {
  return <TxPage tx={tx} txBlock={txBlock} txDetails={<TxDetails tx={tx} txBlock={txBlock} />} />;
}
