'use client';

import { FC } from 'react';
import * as React from 'react';
import { TbArrowUpRight } from 'react-icons/tb';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { Box } from '../../../../ui/Box';
import { Stack } from '../../../../ui/Stack';
import { TextLink } from '../../../../ui/TextLink';
import { getSenderName } from '../utils';

export const Sender: FC<{ tx: Transaction | MempoolTransaction }> = ({ tx }) => (
  <KeyValueHorizontal
    label={getSenderName(tx.tx_type)}
    value={
      <Stack isInline>
        <Box color={'textCaption'}>
          <TbArrowUpRight size="16px" />
        </Box>
        <ExplorerLink href={`/address/${encodeURIComponent(tx.sender_address)}`}>
          <TextLink as="a" fontSize={'14px'} fontWeight={500}>
            {tx.sender_address}
          </TextLink>
        </ExplorerLink>
      </Stack>
    }
    copyValue={tx.sender_address}
  />
);
