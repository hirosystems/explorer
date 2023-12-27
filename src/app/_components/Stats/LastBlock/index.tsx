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
import { BitcoinIcon } from '../../../../ui/icons';
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
        <Flex
          alignItems={'center'}
          ml={1.5}
          lineHeight={'1em'}
          position={'relative'}
          top={0.5}
          gap={1.5}
        >
          <Icon as={BitcoinIcon} size={4.5} />#{lastBurnBlockHeight}
        </Flex>
      }
      caption={
        <>
          {lastBlockTxsCount} transaction{lastBlockTxsCount !== 1 ? 's' : ''}
        </>
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
