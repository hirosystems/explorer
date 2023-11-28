'use client';

import * as React from 'react';
import { FaBitcoin } from 'react-icons/fa';

import { Circle } from '../../../../common/components/Circle';
import { useSuspenseBlockListInfinite } from '../../../../common/queries/useBlockListInfinite';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function LastBlockBase(props: GridProps) {
  const { data: blocks } = useSuspenseBlockListInfinite();
  const lastBlockHeight = blocks?.pages?.[0]?.results?.[0]?.height;
  const lastBurnBlockHeight = blocks?.pages?.[0]?.results?.[0]?.burn_block_height;
  const lastBlockTxsCount = blocks?.pages?.[0]?.results?.[0]?.txs?.length;

  return (
    <StatSection
      title="Last Block"
      bodyMainText={`#${lastBlockHeight}`}
      bodySecondaryText={
        <Flex alignItems={'center'}>
          <Circle size={18} mr={'3px'}>
            <Icon as={FaBitcoin} color={'icon'} size={18} />
          </Circle>
          {lastBurnBlockHeight}
        </Flex>
      }
      caption={
        <Box fontSize={'12px'} color={'textCaption'} fontWeight="500">
          <Text color={'textTitle'} display={'inline-block'}>
            {lastBlockTxsCount}
          </Text>{' '}
          transaction
          {lastBlockTxsCount !== 1 ? 's' : ''}
        </Box>
      }
      {...props}
    />
  );
}

export function LastBlock(props: GridProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Box}
      wrapperProps={{ borderRightWidth: ['0px', '0px', '0px', '1px'] }}
      tryAgainButton
    >
      <LastBlockBase {...props} />
    </ExplorerErrorBoundary>
  );
}
