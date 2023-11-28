'use client';

import * as React from 'react';

import { useSuspenseStxSupply } from '../../../../common/queries/useStxSupply';
import { numberToString } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function StxSupplyBase(props: GridProps) {
  const {
    data: { total_stx, unlocked_stx, unlocked_percent },
  } = useSuspenseStxSupply();
  return (
    <StatSection
      title="STX Supply"
      bodyMainText={numberToString(unlocked_stx ? Number(unlocked_stx) : 0)}
      bodySecondaryText={`/ ${numberToString(total_stx ? Number(total_stx) : 0)}`}
      caption={
        <Flex fontSize={'12px'} color={'textTitle'} fontWeight="500" alignItems={'center'}>
          {Number(unlocked_percent || 0).toFixed(2)}%&nbsp;
          <Text fontSize={'12px'} color={'textCaption'}>
            {' '}
            is unlocked
          </Text>
        </Flex>
      }
      {...props}
    />
  );
}

export function StxSupply(props: GridProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Box}
      wrapperProps={{ borderRightWidth: ['0px', '0px', '1px', '1px'] }}
      tryAgainButton
    >
      <StxSupplyBase {...props} />
    </ExplorerErrorBoundary>
  );
}
