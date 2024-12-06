'use client';

import { FlexProps } from '@chakra-ui/react';

import { useSuspenseBlockListInfinite } from '../../../../common/queries/useBlockListInfinite';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import BitcoinIcon from '../../../../ui/icons/BitcoinIcon';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function LastBlockBase(props: FlexProps) {
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
          <Icon size={4.5}>
            <BitcoinIcon />
          </Icon>
          #{lastBurnBlockHeight}
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

export function LastBlock(props: FlexProps) {
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
