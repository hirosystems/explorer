import {
  Block,
  MempoolPoisonMicroblockTransaction,
  PoisonMicroblockTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export function PoisonMicroblock({
  tx,
  block,
}: {
  tx: PoisonMicroblockTransaction | MempoolPoisonMicroblockTransaction;
  block?: Block;
}) {
  return <TxPage tx={tx} block={block} txDetails={<TxDetails tx={tx} block={block} />} />;
}
