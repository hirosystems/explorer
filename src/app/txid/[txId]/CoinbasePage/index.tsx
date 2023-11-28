import {
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export function CoinbasePage({ tx }: { tx: CoinbaseTransaction | MempoolCoinbaseTransaction }) {
  return <TxPage tx={tx} txDetails={<TxDetails tx={tx} />} />;
}
