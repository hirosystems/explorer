'use client';

import { FC } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { Badge } from '../../../../common/components/Badge';
import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { StxPriceButton } from '../../../../common/components/StxPriceButton';
import { Value } from '../../../../common/components/Value';
import { microToStacksFormatted } from '../../../../common/utils/utils';
import { Flex } from '../../../../ui/Flex';
import { useColorMode } from '../../../../ui/hooks/useColorMode';

export const Fees: FC<{ tx: Transaction | MempoolTransaction }> = ({ tx }) => {
  const stxValue = microToStacksFormatted(tx.fee_rate);
  const colorMode = useColorMode().colorMode;
  return (
    <KeyValueHorizontal
      label={'Fees'}
      value={
        <Flex alignItems={'center'}>
          <Flex alignItems={'center'}>
            <Value>{stxValue} STX</Value>
            <StxPriceButton tx={tx} value={Number(tx.fee_rate)} />
          </Flex>
          {tx.sponsored ? (
            <Badge ml="16px" bg={`bg.${colorMode}`} color={`textTitle.${colorMode}`}>
              Sponsored
            </Badge>
          ) : null}
        </Flex>
      }
      copyValue={stxValue.toString()}
    />
  );
};
