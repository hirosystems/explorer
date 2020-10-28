import React from 'react';
import NextLink from 'next/link';

import { Grid, transition, FlexProps } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';

import { color } from '@components/color-modes';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { BlockLink } from '@components/links';
import { border, toRelativeTime, truncateMiddle } from '@common/utils';

import { Section } from '@components/section';
import { FetchBlocksListResponse } from '@common/api/blocks';

const ViewAllButton: React.FC<{ isLoadingMore?: boolean; onClick?: () => void }> = React.memo(
  ({ onClick, isLoadingMore }) =>
    onClick ? (
      <Grid
        as="a"
        borderTop={border()}
        px="base"
        py="base"
        placeItems="center"
        bg={color('bg')}
        _hover={{ bg: color('bg-alt') }}
        onClick={onClick}
      >
        <Caption>{isLoadingMore ? 'Loading...' : 'Load more'}</Caption>
      </Grid>
    ) : (
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
    )
);

const BlockItem: React.FC<{ block: Block; index: number; length: number }> = React.memo(
  ({ block, index, length, ...rest }) => (
    <BlockLink hash={block.hash} {...rest}>
      <Grid
        px="base"
        py="base"
        gridTemplateColumns="repeat(4, 1fr)"
        borderLeft="3px solid"
        borderLeftColor={color('bg')}
        borderBottom={index === length - 1 ? 'unset' : '1px solid'}
        borderBottomColor="var(--colors-border)"
        transition={transition}
        color={color('text-body')}
        _hover={{
          bg: color('bg-alt'),
          borderLeftColor: color('accent'),
        }}
        as="a"
        {...rest}
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
  )
);

const SectionHeadingRow = React.memo(() => (
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
));

export const BlocksList: React.FC<
  {
    blocks: FetchBlocksListResponse['results'];
    loadMore?: any;
    isLoadingMore?: boolean;
  } & FlexProps
> = React.memo(({ blocks, loadMore, isLoadingMore, ...props }) => {
  return (
    <Section title="Recent Blocks" {...props}>
      <>
        {blocks?.length ? (
          <>
            <SectionHeadingRow />
            {blocks.length
              ? blocks?.map((block: Block, key: number, arr: any) => {
                  return <BlockItem block={block} index={key} key={key} length={arr.length} />;
                })
              : null}
          </>
        ) : (
          <Grid px="base" py="64px" placeItems="center">
            <Caption>
              The network was recently reset. Blocks should start streaming in soon.
            </Caption>
          </Grid>
        )}
        <ViewAllButton isLoadingMore={isLoadingMore} onClick={loadMore} />
      </>
    </Section>
  );
});
