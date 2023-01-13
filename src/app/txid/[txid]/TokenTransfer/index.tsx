import * as React from 'react';

import {
  Block,
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export const TokenTransferPage: React.FC<{
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
  block?: Block;
}> = ({ tx, block }) => {
  return <TxPage tx={tx} block={block} txDetails={<TxDetails tx={tx} block={block} />} />;
};
