import { TransactionStatus } from '@/common/constants';
import { Box, Flex, IconButton } from '@/ui/components';
import QuestionMarkCircleOutlineIcon from 'mdi-react/QuestionMarkCircleOutlineIcon';
import * as React from 'react';
import { FC } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';

export const NonCanonical: FC<{
  tx: Transaction | MempoolTransaction;
}> = ({ tx }) => {
  const showNonCanonical =
    (tx.tx_status !== TransactionStatus.PENDING && 'canonical' in tx && !tx.canonical) ||
    ('microblock_canonical' in tx && !tx.microblock_canonical);
  if (!showNonCanonical) return null;
  return (
    <KeyValueHorizontal
      label={'Non-canonical'}
      value={
        <Flex alignItems="center">
          <Box>
            Transaction is in a non-canonical fork. It has been orphaned by the canonical chain.
          </Box>
          <IconButton
            ml="8px"
            icon={<QuestionMarkCircleOutlineIcon />}
            as="a"
            href="https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md#committing-to-a-chain-tip"
            target="_blank"
            aria-label={'sip-001'}
          />
        </Flex>
      }
    />
  );
};
