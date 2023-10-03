import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Value } from '../../../common/components/Value';

export function Nonce({ tx }: { tx: Transaction | MempoolTransaction }) {
  return (
    <KeyValueHorizontal
      label="Nonce"
      value={<Value>{tx.nonce}</Value>}
      copyValue={tx.nonce.toString()}
    />
  );
}
