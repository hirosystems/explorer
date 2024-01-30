'use client';

import * as React from 'react';
import { FC } from 'react';
import { TbArrowUpRight } from 'react-icons/tb';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { Box } from '../../../../ui/Box';
import { HStack } from '../../../../ui/HStack';
import { getSenderName } from '../utils';

export const Sender: FC<{ tx: Transaction | MempoolTransaction }> = ({ tx }) => (
  <KeyValueHorizontal
    label={getSenderName(tx.tx_type)}
    value={
      <HStack>
        <Box>
          <TbArrowUpRight size="16px" />
        </Box>
        <ExplorerLink
          fontSize={'xs'}
          fontWeight={'medium'}
          href={`/address/${encodeURIComponent(tx.sender_address)}`}
        >
          {tx.sender_address}
        </ExplorerLink>
      </HStack>
    }
    copyValue={tx.sender_address}
  />
);
