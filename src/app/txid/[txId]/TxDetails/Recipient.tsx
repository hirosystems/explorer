import * as React from 'react';
import { FC } from 'react';
import { TbArrowDownRight } from 'react-icons/tb';

import {
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { Box } from '../../../../ui/Box';
import { HStack } from '../../../../ui/HStack';

export const Recipient: FC<{ tx: TokenTransferTransaction | MempoolTokenTransferTransaction }> = ({
  tx,
}) => (
  <KeyValueHorizontal
    label={'Recipient'}
    value={
      <HStack>
        <Box>
          <TbArrowDownRight size="16px" />
        </Box>
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
