import React, { Fragment, useMemo } from 'react';
import { color, Flex, FlexProps, Grid, Spinner } from '@stacks/ui';
import { Section } from '@components/section';
import { HoverableItem } from '@components/hoverable';
import { Caption } from '@components/typography';
import { BlockItem } from './block-list-item';
import { MicroblockItem } from './microblock-list-item';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { SectionFooterAction } from '@components/section-footer-button';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { useInfiniteQuery } from 'react-query';
import { getNextPageParam } from '@store/common';
import { useHomeQueries } from '@features/home/useHomeQueries';

function useBlockList(limit: number) {
  const queries = useHomeQueries();
  const { data: blocks, ...actions } = useInfiniteQuery(
    ['blocks'],
    ({ pageParam }) => queries.fetchBlocks(limit, pageParam || 0)(),
    { getNextPageParam }
  );
  return { blocks, actions };
}

export const BlocksList: React.FC<
  FlexProps & { enforceLimit?: boolean; limit: number; infinite?: boolean }
> = ({ infinite, limit = DEFAULT_LIST_LIMIT, enforceLimit, ...props }) => {
  const { blocks, actions } = useBlockList(limit);
  const hasBlocks = blocks?.pages?.[0]?.results?.length;
  const firstPage = blocks?.pages?.[0].results;

  // due to the way that we fetch from two endpoints (blocks and microblocks)
  // we need to generate a combined flat list of hashes to know which hashes
  // fall within a given limit
  const hashesToShow = useMemo(() => {
    if (!enforceLimit) return {};
    const _index: Record<string, number> = {};
    const flatmap = (firstPage || [])
      .map(block => [block.hash, ...block.microblocks_accepted.map(mb => mb)])
      .flat(5);

    flatmap.forEach((hash, index) => {
      _index[hash] = index + 1;
    });
    return _index;
  }, [firstPage, enforceLimit]);

  if (!blocks) return null;

  return (
    <Section title="Recent Blocks" {...props}>
      <Flex flexDirection="column" flexGrow={1} px="loose">
        {hasBlocks ? (
          <>
            {blocks.pages.map(page => {
              return (
                <Fragment key={page.offset}>
                  {page?.results.map((block, index, arr) => {
                    if (enforceLimit && hashesToShow[block.hash] > limit) return null;
                    return (
                      <Fragment key={block.hash}>
                        <HoverableItem>
                          <BlockItem block={block} index={index} length={arr.length} />
                        </HoverableItem>
                        {block.microblocks_accepted.map((microblockHash, microblockIndex) => {
                          if (enforceLimit && hashesToShow[microblockHash] > limit) return null;

                          return (
                            <SafeSuspense fallback={<></>} key={microblockHash}>
                              <HoverableItem>
                                <MicroblockItem
                                  blockTime={block.burn_block_time}
                                  hash={microblockHash}
                                  index={microblockIndex}
                                  length={arr.length}
                                />
                              </HoverableItem>
                            </SafeSuspense>
                          );
                        })}
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            })}

            <SectionFooterAction
              path="blocks"
              isLoading={actions.isFetchingNextPage}
              onClick={actions.fetchNextPage}
              showLoadMoreButton={infinite}
              hasNextPage={actions.hasNextPage}
            />
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
