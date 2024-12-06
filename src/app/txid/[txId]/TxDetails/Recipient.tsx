import { ArrowDownRight } from '@phosphor-icons/react';
import { FC } from 'react';

import {
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';

export const Recipient: FC<{ tx: TokenTransferTransaction | MempoolTokenTransferTransaction }> = ({
  tx,
}) => (
  <KeyValueHorizontal
    label={'Recipient'}
    value={
      <HStack>
        <Icon size={4}>
          <ArrowDownRight />
        </Icon>
        <ExplorerLink
          fontSize={'14px'}
          fontWeight={'medium'}
          href={`/address/${encodeURIComponent(tx.token_transfer.recipient_address)}`}
        >
          {tx.token_transfer.recipient_address}
        </ExplorerLink>
      </HStack>
    }
    copyValue={tx.token_transfer.recipient_address}
  />
);
