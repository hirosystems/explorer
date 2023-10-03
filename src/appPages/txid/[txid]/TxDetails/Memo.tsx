import {
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { getMemoString } from '@/common/utils';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Value } from '../../../common/components/Value';

export function Memo({ tx }: { tx: TokenTransferTransaction | MempoolTokenTransferTransaction }) {
  const memo = getMemoString(tx.token_transfer.memo);
  if (!memo) return null;
  return <KeyValueHorizontal label="Memo" value={<Value>{memo}</Value>} copyValue={memo} />;
}
