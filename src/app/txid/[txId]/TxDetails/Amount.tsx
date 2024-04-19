import { FC } from 'react';
import * as React from 'react';

import {
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { Circle } from '../../../../common/components/Circle';
import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { StxPriceButton } from '../../../../common/components/StxPriceButton';
import { microToStacks, microToStacksFormatted } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';

export const Amount: FC<{ tx: TokenTransferTransaction | MempoolTokenTransferTransaction }> = ({
  tx,
}) => {
  const stxValue = microToStacksFormatted(tx.token_transfer.amount);
  return (
    <KeyValueHorizontal
      label={'Amount'}
      value={
        <Flex alignItems={'center'}>
          <HStack alignItems="flex-start" gap={2}>
            <Text fontSize="16px" color={'textTitle'} fontWeight="500">
              {stxValue}{' '}
              <Text as="span" display="inline" opacity="0.5">
                STX
              </Text>
            </Text>
          </HStack>
          <StxPriceButton tx={tx} value={Number(tx.token_transfer.amount)} />
        </Flex>
      }
      copyValue={stxValue.toString()}
    />
  );
};
