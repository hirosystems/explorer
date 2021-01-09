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
    const lockBlock = balances?.stx?.burnchain_lock_height || 0;
    const unlockBlock = balances?.stx?.burnchain_unlock_height || 0;

    const cycleLengthInBlocks = unlockBlock - lockBlock;
    const blocksLeftUntilCycleEnds = unlockBlock - currentBlock;

    const amount = Math.floor(
      ((cycleLengthInBlocks - blocksLeftUntilCycleEnds) / cycleLengthInBlocks) * 100
    );

    const stackingPercent = amount < 0 ? 0 : amount;

    return (
      <Box px="base">
        <Stack spacing="tight" borderTop={border()} py="loose">
          <Caption>Stacking progress</Caption>
          {stackingPercent <= 100 ? (
            <Box mt="extra-tight">
              <Flex mb="base-tight" alignItems="center">
                <Box mr="tight" size="20px">
                  <PercentageCircle percentage={stackingPercent} />
                </Box>
                <Text color={color('text-title')}>
                  {stackingPercent.toLocaleString()}% completed
                </Text>
              </Flex>
              <Box>
                <Text color={color('text-title')}>{blocksLeftUntilCycleEnds} blocks left</Text>
              </Box>
            </Box>
          ) : (
            <Text color={color('text-title')}>Completed at #{unlockBlock}</Text>
          )}
        </Stack>
      </Box>
    );
  }
  return null;
};
