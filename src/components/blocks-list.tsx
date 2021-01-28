import React, { useCallback } from 'react';
import NextLink from 'next/link';

import { Grid, Flex, FlexProps, Box, Stack, color, Spinner } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';

import { Block } from '@blockstack/stacks-blockchain-api-types';
import { BlockLink } from '@components/links';
import { addSepBetweenStrings, border, toRelativeTime, truncateMiddle } from '@common/utils';
import pluralize from 'pluralize';
import { Section } from '@components/section';
import { ItemIcon } from '@components/item-icon';
import { HoverableItem, useHoverableState } from '@components/hoverable';
import { useFetchBlocks } from '@common/hooks/data/use-fetch-blocks';
import HashtagIcon from 'mdi-react/HashtagIcon';
import { useLoading } from '@common/hooks/use-loading';
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
          <Stack as="span" isInline alignItems="center" spacing="base">
            <ItemIcon type="block" />
            <Stack spacing="tight" as="span">
              <Flex color={color(isHovered ? 'brand' : 'text-title')} alignItems="center">
                <Box size="16px" as={HashtagIcon} mr="1px" opacity={0.5} color="currentColor" />
                <Title display="block" color="currentColor">
                  {String(block.height)}
                </Title>
              </Flex>
              <Caption display="block">
                {addSepBetweenStrings([
                  `${block.txs.length} ${pluralize('transactions', block.txs.length)}`,
                ])}
              </Caption>
            </Stack>
          </Stack>
          <Stack spacing="tight" textAlign="right" as="span">
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
    fetchKey: string;
    limit?: number;
    infinite?: boolean;
  } & FlexProps
> = ({ fetchKey, limit, infinite, ...props }) => {
  const blocks = useFetchBlocks({
    key: fetchKey,
    limit: limit,
  });
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();
  const { hasNextPage, fetchNextPage } = blocks;

  const handleLoadMore = useCallback(async () => {
    doStartLoading();
    await fetchNextPage();
    doFinishLoading();
  }, [doStartLoading, fetchNextPage, doFinishLoading]);

  return (
    <Section isLoading={isLoading} title="Recent Blocks" {...props}>
      <Flex flexDirection="column" flexGrow={1} px="loose">
        {blocks?.data?.pages?.length ? (
          <>
            {blocks.data.pages.map((page: FetchBlocksListResponse, index: number) => (
              <React.Fragment key={index}>
                {page.results?.map((block: Block, key: number, arr: any) => {
                  return (
                    <HoverableItem
                      key={`blocks-list-${block.height}`}
                      isLast={index === blocks?.data?.pages?.length - 1 && key === arr.length - 1}
                    >
                      <BlockItem block={block} index={key} length={arr.length} />
                    </HoverableItem>
                  );
                })}
              </React.Fragment>
            ))}
            {infinite ? (
              hasNextPage ? (
                <ViewAllButton isLoadingMore={isLoading} onClick={handleLoadMore} />
              ) : null
            ) : (
              <ViewAllButton />
            )}
          </>
        ) : (
          <Grid alignContent="center" flexGrow={1} px="base" py="64px" placeItems="center">
            <Spinner size="lg" color={color('text-caption')} />
            <Caption mt="extra-loose" maxWidth="38ch">
              Blocks should start streaming in soon.
            </Caption>
          </Grid>
        )}
      </Flex>
    </Section>
  );
};
