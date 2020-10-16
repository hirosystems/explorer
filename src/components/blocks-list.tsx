import React from 'react';
import NextLink from 'next/link';

import { Flex, Grid, Box, transition, FlexProps } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';

import { Card } from '@components/card';
import { color } from '@components/color-modes';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { BlockLink } from '@components/links';
import { border, toRelativeTime, truncateMiddle } from '@common/utils';
import { useSelector } from 'react-redux';
import { selectBlocks } from '@store/blocks/selectors';
import { RootState } from '@store';
import { Section } from '@components/section';

const ViewAllButton: React.FC = props => (
  <NextLink href="/blocks" passHref>
    <Grid
      as="a"
      borderTop={border()}
      px="base"
      py="base"
      placeItems="center"
      bg={color('bg')}
      _hover={{ bg: color('bg-alt') }}
    >
      <Caption>View all blocks</Caption>
    </Grid>
  </NextLink>
);

export const BlocksList: React.FC<FlexProps> = props => {
  const { blocks } = useSelector((state: RootState) => ({
    blocks: selectBlocks(state),
  }));

  return (
    <Section title="Recent Blocks" {...props}>
      <>
        {blocks?.length ? (
          <>
            <Grid px="base" py="tight" gridTemplateColumns="repeat(4, 1fr)" borderBottom={border()}>
              <Caption>Block height</Caption>
              <Caption width="100%" textAlign="right">
                Block hash
              </Caption>
              <Caption width="100%" textAlign="right">
                Transactions
              </Caption>
              <Caption width="100%" textAlign="right">
                Mined
              </Caption>
            </Grid>
            {blocks?.map((block: Block, key: number, arr: any) => {
              return (
                <BlockLink hash={block.hash} key={key}>
                  <Grid
                    px="base"
                    py="base"
                    gridTemplateColumns="repeat(4, 1fr)"
                    borderLeft="3px solid"
                    borderLeftColor={color('bg')}
                    borderBottom={key === arr.length - 1 ? 'unset' : '1px solid'}
                    borderBottomColor="var(--colors-border)"
                    transition={transition}
                    color={color('text-body')}
                    _hover={{
                      bg: color('bg-alt'),
                      borderLeftColor: color('accent'),
                    }}
                    as="a"
                  >
                    <Title display="block">#{block.height}</Title>
                    <Text display="block" width="100%" textAlign="right">
                      {truncateMiddle(block.hash, 9)}
                    </Text>
                    <Text width="100%" textAlign="right">
                      {block.txs.length}
                    </Text>
                    <Text display="block" width="100%" textAlign="right">
                      {toRelativeTime(block.burn_block_time * 1000)}
                    </Text>
                  </Grid>
                </BlockLink>
              );
            })}
          </>
        ) : (
          <Grid px="base" py="64px" placeItems="center">
            <Caption>
              The network was recently reset. Blocks should start streaming in soon.
            </Caption>
          </Grid>
        )}
        <ViewAllButton />
      </>
    </Section>
  );
};
