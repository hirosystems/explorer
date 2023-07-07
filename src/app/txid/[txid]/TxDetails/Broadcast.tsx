import { toRelativeTime } from '@/common/utils';
import { Box, Flex, Icon, Tooltip } from '@/ui/components';
import * as React from 'react';
import { FC } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';

import { Transaction, MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Value } from '../../../common/components/Value';
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
                <Value>{toRelativeTime(ts * 1000)}</Value>
              </Flex>
            </Tooltip>
          </Box>
        </>
      }
      copyValue={readableTs}
    />
  );
};
