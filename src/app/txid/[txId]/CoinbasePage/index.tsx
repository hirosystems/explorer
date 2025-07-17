import {
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export default function CoinbasePage({ tx }: { tx: CoinbaseTransaction | MempoolCoinbaseTransaction }) {
  console.log('rendering coinbase tx');
  return <TxPage tx={tx} txDetails={<TxDetails tx={tx} />} />;
}
