'use client';

import { Flex } from '@chakra-ui/react';
import { FC } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { Badge } from '../../../../common/components/Badge';
import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { StxPriceButton } from '../../../../common/components/StxPriceButton';
import { Value } from '../../../../common/components/Value';
import { microToStacksFormatted } from '../../../../common/utils/utils';

export const Fees: FC<{ tx: Transaction | MempoolTransaction }> = ({ tx }) => {
  const stxValue = microToStacksFormatted(tx.fee_rate);
  const sponsorText =
    tx.sponsored && tx.sponsor_address ? ` (sponsored by ${tx.sponsor_address})` : '';
  const fullCopyValue = `${stxValue} ${sponsorText}`;
  return (
    <KeyValueHorizontal
      label={'Fees'}
      value={
        <Flex alignItems={'center'}>
          <Flex alignItems={'center'}>
            <Value>{stxValue} STX</Value>
            <StxPriceButton tx={tx} value={Number(tx.fee_rate)} />
          </Flex>
          {tx.sponsored && (
            <Flex alignItems={'center'}>
              <Badge ml={4} color="text" mr={4}>
                Sponsored By
              </Badge>
              <Value>{tx.sponsor_address}</Value>
            </Flex>
          )}
        </Flex>
      }
      copyValue={fullCopyValue.toString()}
    />
  );
};
