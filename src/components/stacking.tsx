import * as React from 'react';
import { Box, Flex, color, Stack } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { border } from '@common/utils';
import { useStacksInfo } from '@common/hooks/use-stacks-info';
import { Pending } from '@components/status';
import { PercentageCircle } from '@components/percentage-circle';

export const StackingPercentage = ({ balances, stackingBlock }: any) => {
  const { data } = useStacksInfo();

  if (stackingBlock) {
    if (!data) {
      return (
        <Box px="base">
          <Stack spacing="tight" borderTop={border()} py="loose">
            <Caption>Stacking progress</Caption>
            <Flex alignItems="center">
              <Pending size="14px" mr="tight" />
              <Text color={color('text-title')}>Calculating...</Text>
            </Flex>
          </Stack>
        </Box>
      );
    }

    const currentBlock = data?.burn_block_height || 0;
    const unlockBlock = balances?.stx?.unlock_height || 0;
    const blockDelta = balances?.stx?.unlock_height - stackingBlock;
    const blocksUntilCycleCompletes = currentBlock - stackingBlock;

    const stackingPercent = (blocksUntilCycleCompletes / blockDelta) * 100;
    return (
      <Box px="base">
        <Stack spacing="tight" borderTop={border()} py="loose">
          <Caption>Stacking progress</Caption>
          <Flex alignItems="center">
            <Box mr="tight" size="20px">
              <PercentageCircle percentage={stackingPercent} />
            </Box>
            <Text color={color('text-title')}>{stackingPercent.toLocaleString()}% completed</Text>
          </Flex>
        </Stack>
      </Box>
    );
  }

  return null;
};
