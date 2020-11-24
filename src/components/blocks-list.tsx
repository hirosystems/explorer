import React from 'react';
import NextLink from 'next/link';

import { Grid, Flex, FlexProps, Box, Stack } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';

import { color } from '@components/color-modes';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { BlockLink } from '@components/links';
import { addSepBetweenStrings, border, toRelativeTime, truncateMiddle } from '@common/utils';
import pluralize from 'pluralize';
import { Section } from '@components/section';
import { FetchBlocksListResponse } from '@common/api/blocks';
import { ItemIcon } from '@components/item-icon';
import { HoverableItem, useHoverableState } from '@components/hoverable';

const ViewAllButton: React.FC<{ isLoadingMore?: boolean; onClick?: () => void }> = React.memo(
  ({ onClick, isLoadingMore }) =>
    onClick ? (
      <Grid
        as="a"
        borderTop={border()}
        px="base"
        py="base"
        placeItems="center"
        _hover={{ color: color('text-title') }}
        onClick={onClick}
        color={color('text-caption')}
      >
        <Caption color="currentColor">{isLoadingMore ? 'Loading...' : 'Load more'}</Caption>
      </Grid>
    ) : (
      <NextLink href="/blocks" passHref>
        <Grid
          as="a"
          borderTop={border()}
          px="base"
          py="base"
          placeItems="center"
          _hover={{ color: color('text-title') }}
          onClick={onClick}
          color={color('text-caption')}
        >
          <Caption color="currentColor">View all blocks</Caption>
        </Grid>
      </NextLink>
    )
);

const BlockItem: React.FC<{ block: Block; index: number; length: number }> = React.memo(
  ({ block, index, length, ...rest }) => {
    const isHovered = useHoverableState();
    return (
      <BlockLink hash={block.hash} {...rest}>
        <Flex
          justifyContent="space-between"
          py="loose"
          color={color('text-body')}
          _hover={{
            borderLeftColor: color('accent'),
          }}
          as="a"
          {...rest}
        >
          <Stack isInline alignItems="center" spacing="base">
            <ItemIcon type="block" />
            <Stack spacing="tight">
              <Title display="block" color={isHovered ? color('accent') : color('text-title')}>
                #{block.height}
              </Title>
              <Caption display="block">
                {addSepBetweenStrings([
                  `${block.txs.length} ${pluralize('transactions', block.txs.length)}`,
                ])}
              </Caption>
            </Stack>
          </Stack>
          <Stack spacing="tight" textAlign="right">
            <Text
              fontSize="14px"
              width="100%"
              textAlign="right"
              color={color('text-body')}
              display="block"
            >
              {toRelativeTime(block.burn_block_time * 1000)}
            </Text>
            <Caption display="block">{truncateMiddle(block.hash)}</Caption>
          </Stack>
        </Flex>
      </BlockLink>
    );
  }
);

export const BlocksList: React.FC<
  {
    blocks: FetchBlocksListResponse['results'];
    loadMore?: any;
    isLoadingMore?: boolean;
  } & FlexProps
> = React.memo(({ blocks, loadMore, isLoadingMore, ...props }) => {
  return (
    <Section title="Recent Blocks" {...props}>
      <Box px="loose">
        {blocks?.length ? (
          <>
            {blocks.length
              ? blocks?.map((block: Block, key: number, arr: any) => {
                  return (
                    <HoverableItem key={key} isLast={key === arr.length - 1}>
                      <BlockItem block={block} index={key} length={arr.length} />
                    </HoverableItem>
                  );
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
      </Box>
    </Section>
  );
});
