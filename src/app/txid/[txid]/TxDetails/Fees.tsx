import { Badge } from '@/common/components/Badge';
import { microToStacks } from '@/common/utils';
import { Flex } from '@/ui/components';
import * as React from 'react';
import { FC } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { StxPriceButton } from '../../../common/components/StxPriceButton';
import { Value } from '../../../common/components/Value';

export const Fees: FC<{ tx: Transaction | MempoolTransaction }> = ({ tx }) => {
  const stxValue = microToStacks(tx.fee_rate);
  return (
    <KeyValueHorizontal
      label={'Fees'}
      value={
        <>
          <Flex
            flexDirection={['column', 'column', 'row']}
            alignItems={['flex-start', 'flex-start', 'center']}
          >
            <Value>{stxValue} STX</Value>
            <StxPriceButton tx={tx} value={Number(tx.fee_rate)} />
          </Flex>
          {tx.sponsored ? (
            <Badge ml="16px" bg="ink.300" border={'none'}>
              Sponsored
            </Badge>
          ) : null}
        </>
      }
      copyValue={stxValue.toString()}
    />
  );
};
