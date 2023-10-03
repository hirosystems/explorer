import {
  Block,
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export function TokenTransferPage({
  tx,
  block,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
  block?: Block;
}) {
  return <TxPage tx={tx} block={block} txDetails={<TxDetails tx={tx} block={block} />} />;
}
