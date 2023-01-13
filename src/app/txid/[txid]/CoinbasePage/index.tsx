import { FC } from 'react';

import {
  Block,
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export const CoinbasePage: FC<{
  tx: CoinbaseTransaction | MempoolCoinbaseTransaction;
  block?: Block;
}> = ({ tx, block }) => {
  return <TxPage tx={tx} block={block} txDetails={<TxDetails tx={tx} block={block} />} />;
};
