import { microToStacks } from '@/common/utils';
import { Circle } from '@/components/circle';
import { Box, Stack } from '@/ui/components';
import { StxIcon } from '@/ui/icons/StxIcon';
import { Text } from '@/ui/typography';
import * as React from 'react';
import { FC } from 'react';

import {
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { StxPriceButton } from '../../../common/components/StxPriceButton';

export const Amount: FC<{ tx: TokenTransferTransaction | MempoolTokenTransferTransaction }> = ({
  tx,
}) => {
  const stxValue = microToStacks(tx.token_transfer.amount);
  return (
    <KeyValueHorizontal
      label={'Amount'}
      value={
        <>
          <Stack alignItems="flex-start" isInline spacing="8px">
            <Box width="24px" position="relative">
              <Circle position="absolute" left={0} size="24px" bg={'accent'}>
                <StxIcon strokeWidth={2} size="14px" color="white" />
              </Circle>
            </Box>
            <Text fontSize="16px" color={'textTitle'} fontWeight="500">
              {stxValue}{' '}
              <Text as="span" display="inline" opacity="0.5">
                STX
              </Text>
            </Text>
          </Stack>
          <StxPriceButton tx={tx} value={Number(tx.token_transfer.amount)} />
        </>
      }
      copyValue={stxValue.toString()}
    />
  );
};
