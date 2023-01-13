import * as React from 'react';

import {
  Block,
  MempoolPoisonMicroblockTransaction,
  PoisonMicroblockTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export const PoisonMicroblock: React.FC<{
  tx: PoisonMicroblockTransaction | MempoolPoisonMicroblockTransaction;
  block?: Block;
}> = ({ tx, block }) => {
  return <TxPage tx={tx} block={block} txDetails={<TxDetails tx={tx} block={block} />} />;
};
