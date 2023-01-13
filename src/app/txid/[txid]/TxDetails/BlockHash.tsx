import { BlockLink } from '@/components/links';
import { TextLink } from '@/ui/components';
import * as React from 'react';
import { FC } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';

export const BlockHash: FC<{
  tx: Transaction | MempoolTransaction;
}> = ({ tx }) => {
  if (
    !('block_hash' in tx) ||
    typeof tx.block_hash === 'undefined' ||
    (tx?.tx_status === 'success' && tx.is_unanchored)
  )
    return null;
  return (
    <KeyValueHorizontal
      label={'Block hash'}
      value={
        <BlockLink hash={tx.block_hash}>
          <TextLink fontSize={'14px'} fontWeight={500}>
            {tx.block_hash}
          </TextLink>
        </BlockLink>
      }
      copyValue={tx.block_hash}
    />
  );
};
