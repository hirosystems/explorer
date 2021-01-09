import * as React from 'react';

import { Box, Flex, color } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { Section } from '@components/section';
import { border, microToStacks } from '@common/utils';
import { VestingData } from '@common/utils/addresses';

export const StacksTokenVestingCard: React.FC<{ vesting: VestingData }> = ({ vesting }) => {
  const percent = (vesting?.totalUnlocked / vesting?.vesting_total) * 100;
  return percent ? (
    <Section mt="extra-loose" title="Stacks Token vesting">
      <Box p="base-loose">
        <Box pb="base-loose" mb="base" borderBottom={border()}>
          <Caption>
            Vested<sup>*</sup>
          </Caption>
          <Flex justifyContent="space-between" alignItems="baseline">
            <Text mt="tight" color={color('text-body')}>
              {microToStacks(vesting.totalUnlocked)}
            </Text>
            <Caption>{parseInt(percent.toString())}%</Caption>
          </Flex>
          <Box mt="base" width="100%" height="3px" bg={color('bg-4')}>
            <Box width={`${percent}%`} height="3px" bg={color('brand')} />
          </Box>
        </Box>
        <Box pb="base-loose" mb="base" borderBottom={border()}>
          <Caption>
            Unvested<sup>*</sup>
          </Caption>
          <Text mt="tight" color={color('text-body')}>
            {microToStacks(vesting.totalLocked)}
          </Text>
        </Box>
        <Caption>* Data used from Stacks 1.0</Caption>
      </Box>
    </Section>
  ) : null;
};
