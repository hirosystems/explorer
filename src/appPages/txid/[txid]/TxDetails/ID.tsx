import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Flex } from '@/ui/components';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Value } from '../../../common/components/Value';

export function ID({ tx }: { tx: Transaction | MempoolTransaction }) {
  return (
    <KeyValueHorizontal
      label="Transaction ID"
      value={
        <Flex alignItems="center">
          <Value>{tx.tx_id}</Value>
        </Flex>
      }
      copyValue={tx.tx_id}
    />
  );
}
