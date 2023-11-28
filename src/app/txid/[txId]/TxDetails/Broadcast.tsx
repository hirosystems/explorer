'use client';

import { FC } from 'react';
import * as React from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { Value } from '../../../../common/components/Value';
import { toRelativeTime } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Tooltip } from '../../../../ui/Tooltip';
import { isInMempool } from '../utils';

export const Broadcast: FC<{
  tx: Transaction | MempoolTransaction;
}> = ({ tx }) => {
  if (!isInMempool(tx)) return null;

  const ts = tx.receipt_time;
  if (!ts) return null;

  const readableTs = `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(
    ts * 1000
  ).toLocaleDateString()}`;

  return (
    <KeyValueHorizontal
      label={'Broadcast'}
      value={
        <>
          <Box>
            <Tooltip label={readableTs}>
              <Flex alignItems="center">
                <Icon as={AiOutlineClockCircle} size="16px" mr="4px" />
                <Value suppressHydrationWarning={true}>{toRelativeTime(ts * 1000)}</Value>
              </Flex>
            </Tooltip>
          </Box>
        </>
      }
      copyValue={readableTs}
    />
  );
};
